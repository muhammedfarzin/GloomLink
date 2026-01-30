import { injectable } from "inversify";
import firebaseAdmin from "firebase-admin";
import {
  IExternalAuthService,
  ExternalAuthUser,
} from "../../application/services/IExternalAuthService";
import firebaseServiceAccount from "../configuration/firebase-service-account-file.json";

@injectable()
export class FirebaseAuthService implements IExternalAuthService {
  constructor() {
    if (firebaseAdmin.apps.length === 0) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(
          firebaseServiceAccount as firebaseAdmin.ServiceAccount,
        ),
      });
    }
  }

  async verifyGoogleAuthToken(token: string): Promise<ExternalAuthUser> {
    const decodedData = await firebaseAdmin.auth().verifyIdToken(token);
    return {
      email: decodedData.email!,
      name: decodedData.name!,
      uid: decodedData.uid,
    };
  }
}
