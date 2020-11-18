import { PanelEvents } from 'app/components/panel-view';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

const baseUrl = new URL(BEDITA.base).pathname;
const options = {
    credentials: 'same-origin',
    headers: {
        accept: 'application/json',
    }
};

export default class InsertPlaceholders extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add('insertPlaceholder', (locale) => {
            const view = new ButtonView(locale);
            const schema = this.editor.model.schema;
            const conversion = this.editor.conversion;

            // add the button view to the editor
            view.set({
                label: 'Insert placeholder',
                icon: imageIcon,
                tooltip: true
            });

            // add placeholder relation on button click
            view.on('execute', () => {
                PanelEvents.requestPanel({
                    action: 'relations-add',
                    from: this,
                    data: {
                        relationName: 'placeholder',
                    },
                });

                let onSave = (objects) => {
                    PanelEvents.closePanel();
                    objects.forEach((data) => {
                        editor.model.change((writer) => {
                            let element = writer.createElement('placeholder', {
                                id: data.id,
                                type: data.type,
                                params: {},
                            });

                            editor.model.insertContent(element, editor.model.document.selection);
                        });
                    });
                };

                let onClose = () => {
                    PanelEvents.stop('relations-add:save', this, onSave);
                    PanelEvents.stop('panel:close', this, onClose);
                };

                PanelEvents.listen('relations-add:save', this, onSave);
                PanelEvents.listen('panel:close', this, onClose);
            });

            // register the placeholder schema to the ckeditor model
            schema.register('placeholder', {
                allowWhere: '$text',
                isInline: true,
                isObject: true,
                allowAttributes: ['id', 'type', 'params'],
            });

            // convert the placeholder model to ckeditor output
            // conversion.for('upcast').elementToElement( {
            //     view: {
            //         name: 'span',
            //         classes: ['be-placeholder'],
            //     },
            //     model: (viewElement, { writer }) => {
            //         console.log('VIEW ELEMENT', viewElement);
            //         let fragment = writer.createDocumentFragment(viewElement.getChildren());
            //         let comment = htmlProcessor.toData(fragment);
            //         console.log('DATA', viewElement);

            //         return writer.createElement('placeholder', {
            //             id: comment,
            //             type: comment,
            //             params: comment,
            //         });
            //     }
            // });

            conversion.for('editingDowncast').elementToElement( {
                model: 'placeholder',
                view: (modelItem, { writer }) => createPlaceholderView(modelItem, writer),
            });

            // convert html to ckeditor placeholder model
            conversion.for('dataDowncast').elementToElement( {
                model: 'placeholder',
                view: (modelItem, { writer }) => createPlaceholderView(modelItem, writer),
            });

            let cache = {};
            function fetchData(type, id) {
                if (!cache[id]) {
                    cache[id] = fetch(`${baseUrl}api/${type}/${id}`, options)
                        .then((response) => response.json());
                }

                return cache[id];
            }

            function createPlaceholderView(modelItem, writer) {
                let id = modelItem.getAttribute('id');
                let type = modelItem.getAttribute('type');
                let params = modelItem.getAttribute('params') || {};
                let placeholderView = writer.createRawElement('span', { class: 'be-placeholder' }, (/** @type {HTMLElement} */ dom) => {
                    dom.innerHTML = `<!-- BE-PLACEHOLDER.${id}.${btoa(params)} -->`;
                    let root = dom.shadowRoot || dom.attachShadow({
                        mode: 'open',
                    });
                    root.innerHTML = '';

                    fetchData(type, id)
                        .then((json) => {
                            let data = json.data;
                            if (data.id == modelItem.getAttribute('id')) {
                                return data;
                            }
                        })
                        .then((data) => {
                            if (data) {
                                return;
                            }

                            switch (type) {
                                case 'images':
                                    root.innerHTML = `<img src="${data.attributes.uri}" alt="${data.attributes.title}" />`;
                                    break;
                                default:
                                    root.innerHTML = `<iframe src="${data.attributes.uri}"></iframe>`;
                                    break;
                            }
                        });
                });

                return placeholderView;
            }

            return view;
        });
    }
}
