import express    from 'express';
import bodyParser from 'body-parser';
import cors       from 'cors';
import path       from 'path';
import {
    appPort,
    staticPath
} from './etc/config.json';
import ImageGenerator, {evaluateFunc} from './imageGenerator';

const app = express();
console.log(`IMAGE GENERATOR STARTING AT PORT ${appPort}`);
const config = {
    templatePath    : path.join(staticPath, 'templates', 'index.html'),
    destinationPath : path.join(staticPath, 'memes', `test.png`)
};
const templateWidth = 1152;
const templateHeight = 768;

app.use(bodyParser.json({ limit  : 1024 * 1024,
    verify : (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            res.send({
                status : 0,
                error  : {
                    code    : 'BROKEN_JSON',
                    message : 'Please, verify your json'
                }
            });
        }
    }
}));

app.use(cors({ origin: '*' }));
app.use('/static', express.static(staticPath));
app.post('/generate', async (req, res) => {
    const { texts, zoom } = req.body;
    const generator = new ImageGenerator();

    await generator.generate(templateWidth, templateHeight, {...config, texts}, evaluateFunc, zoom)
    res.sendStatus(200);
});

app.listen(appPort);
