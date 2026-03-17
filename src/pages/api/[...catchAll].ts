import app from '../../../backend/src/index';

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default function handler(req: any, res: any) {
  return app(req, res);
}
