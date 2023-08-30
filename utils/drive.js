import { google } from 'googleapis';
import stream from 'stream';

const drive = () => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectionUrl = process.env.GOOGLE_REDIRECT_URL;
    const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectionUrl
    );

    oAuth2Client.setCredentials({
      refresh_token:
        '1//04B2w6SMQAExWCgYIARAAGAQSNwF-L9Ir5hpljJzysCUcKLnYOO74lqrA94xdRFfH5oCmKuVLEOOtFdgx68Tj_9_Jt0ukgjfWlXc',
    });

    return google.drive({
      version: 'v3',
      auth: oAuth2Client,
    });
  } catch (err) {
    throw err;
  }
};

export const uploadFile = async (fileObj) => {
  try {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObj.buffer);

    const { id: fileId } = await drive()
      .files.create({
        media: {
          mimeType: fileObj.mimeType,
          body: bufferStream,
        },
        requestBody: {
          name: Date.now(),
          parents: [process.env.GOOGLE_USER_FOLDER_ID],
        },
      })
      .then((x) => x.data)
      .catch((err) => {
        throw err;
      });
    return {
      imageUrl: `https://drive.google.com/uc?export=view&id=${fileId}`,
      id: fileId,
    };
  } catch (err) {
    throw err;
  }
};
