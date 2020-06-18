import * as express from 'express';
import { join } from 'path';

const app = express();
const port = process.env.SERVER_PORT || 4095;

const index = (req: express.Request, res: express.Response) => {
  return res.status(200).sendFile(join(__dirname, 'index.html'));
};

app.get('*.*', express.static(join(__dirname), { index: false }));
app.all('/*', index);

app.listen(port, () => console.log(`server running on http://localhost:${port}`));
