import * as firebase from 'firebase'
import 'firebase/firestore'
import * as firebaseAdmin from 'firebase-admin'
import * as path from 'path'
import { mkConfig } from '@env/environment.model'
import { env as environment } from '@env/environment.test'

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

let config = mkConfig(environment);

let app: firebase.app.App

async function initializeAppForUserToken(admin: firebaseAdmin.app.App, uid: string)
: Promise<{ app: firebase.app.App, cred: firebase.auth.UserCredential }> {
  let token = await admin.auth().createCustomToken(uid);

  let app = firebase.initializeApp(config, 'civic-resourcery-test');
  let auth = app.auth();
  let cred = await auth.signInAndRetrieveDataWithCustomToken(token);

  let db = app.firestore();
  db.settings({timestampsInSnapshots: true});

  return { app, cred };
}

describe('database rules', () => {
  const projectRoot = path.join(path.dirname(require.main.filename), '../..');

  let adminApp: firebaseAdmin.app.App;

  let adminDb: firebaseAdmin.firestore.Firestore
  let userNoPermUID: string

  beforeAll(async () => {
    adminApp = await firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(path.join(projectRoot, 'keys', 'admin-key.test.json')),
      databaseURL: config.databaseURL
    });

    let adminAuth = adminApp.auth();
    let { users: existingUsers, pageToken } = await adminAuth.listUsers(10);
    for (let user of existingUsers) {
      await adminAuth.deleteUser(user.uid);
    }
    while (pageToken.length > 0) {
      let { users: existingUsers, pageToken: nextPageToken } = await adminAuth.listUsers(10, pageToken);
      for (let user of existingUsers) {
        await adminAuth.deleteUser(user.uid);
      }
      pageToken = nextPageToken;
    }
    let userNoPerm = await adminAuth.createUser(
      { email: 'user-no-perm-2@example.org',
        password: 'secret'
      });
    userNoPermUID = userNoPerm.uid

    adminDb = adminApp.firestore();
    let metadataColl = await adminDb.collection('app-metadata').get();
    if (metadataColl.size > 0) {
      let batch = adminDb.batch();
      metadataColl.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    }
    await adminDb.doc('app-metadata/name').set({ value: 'app-name' });
    await adminDb.doc('app-metadata/misc').set({ value: 'misc-data' });
  });

  afterAll(async () => {
    if (adminApp) {
      adminApp.delete();
      adminApp = null;
    }
  });

  describe('user with no special permission', () => {
    let app: firebase.app.App;
    let cred: firebase.auth.UserCredential;

    beforeAll(async () => {
      let { app: app_, cred: cred_ } = await initializeAppForUserToken(adminApp, userNoPermUID);
      app = app_; cred = cred_;
    });

    afterAll(async () => {
      if (app) {
        await app.delete();
        app = null;
      }
    })

    it('should not be able to read data by default', async () => {
      expect.hasAssertions();
      await expect(app.firestore().doc('app-metadata/misc').get())
        .rejects.toThrowError('Missing or insufficient permissions');
    });
    it('should be able to read application name', async () => {
      await expect(app.firestore().doc('app-metadata/name').get().then(v => v.data()))
        .resolves.toEqual({ value: 'app-name' });
    });
  });

  // describe('user with admin permission', () => {
  // });
});
