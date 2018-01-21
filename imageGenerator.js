/* eslint-disable */
import phantom from 'phantom';

export default class ImageGenerator {
    async _createPage() {
        const instance = await phantom.create();
        const page = await instance.createPage();

        page.property('onConsoleMessage', msg => {
            console.log('CONSOLE from phantom:' + msg);
        });

        return { instance, page };
    }

    _setSize(page, width, height) {
        page.property('viewportSize', { width, height });
        page.property('clipRect', { top: 0, left: 0, width, height });
    }

    async generate(width, height, config, evaluateFunc, zoom) {
        const { instance, page } = await this._createPage();

        if (zoom) {
            this._setSize(page, width * zoom, height * zoom);
            page.property('zoomFactor', zoom);
        } else {
            this._setSize(page, width, height);
        }

        const status = await page.open(config.templatePath);
        await page.evaluate(evaluateFunc, config);
        if (status !== 'success') {
            await instance.exit(1);
            throw new Error('IMAGE_GENERATOR_FAILED');
        } else {
            await page.render(config.destinationPath, { format: 'jpeg', quality: '100' });
            await instance.exit();
        }
    }
}

export function evaluateFunc(config) {
    var texts = config.texts;
    for (var id in texts) {
        console.log(id, texts[id]);
        document.getElementById(id).innerHTML = '<div>' + texts[id] + '</div>'
    }
}
