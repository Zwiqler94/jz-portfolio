import { ApplicationRef, Injectable, OnInit } from '@angular/core';
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { concat, filter, first, interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceWorkerService {
  readonly publicKey ='BHr4Vvr3Uh3dsAj749pPSlkAbe-qknUpEypYYN1xvm9QN_DRzAo80b2gJSLxvui5cjdMB1FPKiGVHbxtj-dFDJQ';

  constructor(
    private updates: SwUpdate,
    private appRef: ApplicationRef,
    private push: SwPush
  ) {
    updates.versionUpdates.subscribe((event) => {
      switch (event.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${event.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${event.currentVersion.hash}`);
          console.log(
            `New app version ready for use: ${event.latestVersion.hash}`
          );
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(
            `Failed to install app version '${event.version.hash}': ${event.error}`
          );
          break;
      }
    });

    const appIsStable$ = appRef.isStable.pipe(
      first((isStable) => isStable === true)
    );
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await updates.checkForUpdate();
        console.log(
          updateFound
            ? 'A new version is available.'
            : 'Already on the latest version.'
        );
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });

    updates.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe((evt) => {
        alert(evt);
        // Reload the page to update to the latest version.
        document.location.reload();
      });
  }

  async setUpPushNotifications() {
    await this.push.requestSubscription({ serverPublicKey: this.publicKey });
    this.push.messages.subscribe((msg) => alert(msg));
  }

}
