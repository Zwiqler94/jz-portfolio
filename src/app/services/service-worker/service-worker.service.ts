/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { ApplicationRef, Injectable } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { concat, first, interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceWorkerService {
  readonly publicKey =
    'BHr4Vvr3Uh3dsAj749pPSlkAbe-qknUpEypYYN1xvm9QN_DRzAo80b2gJSLxvui5cjdMB1FPKiGVHbxtj-dFDJQ';

  private _video: string;
  private _japanPics: string[] = [];
  private _pics1: string[] = [];
  private _pics2: string[] = [];
  private _pics3: string[] = [];
  private _pics4: string[] = [];
  private _pics5: string[] = [];

  constructor(
    private updates: SwUpdate,
    private appRef: ApplicationRef,
    private push: SwPush,
  ) {
    updates.versionUpdates.subscribe((event) => {
      switch (event.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${event.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${event.currentVersion.hash}`);
          console.log(
            `New app version ready for use: ${event.latestVersion.hash}`,
          );
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(
            `Failed to install app version '${event.version.hash}': ${event.error}`,
          );
          break;
      }
    });

    const appIsStable$ = appRef.isStable.pipe(
      first((isStable) => isStable === true),
    );
    const everySixMinutes$ = interval(60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(
      appIsStable$,
      everySixMinutes$,
    );

    everySixHoursOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await updates.checkForUpdate();
        console.log(
          updateFound
            ? 'A new version is available.'
            : 'Already on the latest version.',
        );
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });

    // updates.versionUpdates
    //   .pipe(
    //     filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
    //   )
    //   .subscribe((evt) => {
    //     // Reload the page to update to the latest version.
    //     document.location.reload();
    //     // this.openSnackbar('Update App?', 'Ok!');
    //   });
  }

  get swUpdates() {
    return this.updates;
  }

  // openSnackbar(message: string, action: string) {
  //   this._snackBar.open(message, action);
  // }

  public get video(): string {
    return this._video;
  }
  public set video(value: string) {
    this._video = value;
  }
  public get japanPics(): string[] {
    return this._japanPics;
  }
  public set japanPics(value: string[]) {
    this._japanPics = value;
  }
  public get pics1(): string[] {
    return this._pics1;
  }
  public set pics1(value: string[]) {
    this._pics1 = value;
  }
  public get pics2(): string[] {
    return this._pics2;
  }
  public set pics2(value: string[]) {
    this._pics2 = value;
  }
  public get pics3(): string[] {
    return this._pics3;
  }
  public set pics3(value: string[]) {
    this._pics3 = value;
  }
  public get pics4(): string[] {
    return this._pics4;
  }
  public set pics4(value: string[]) {
    this._pics4 = value;
  }
  public get pics5(): string[] {
    return this._pics5;
  }
  public set pics5(value: string[]) {
    this._pics5 = value;
  }

  async setUpPushNotifications() {
    await this.push.requestSubscription({ serverPublicKey: this.publicKey });
    this.push.messages.subscribe((msg) => alert(msg));
  }
}
