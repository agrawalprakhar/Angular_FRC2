import { Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { environment } from 'src/environments/environment';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angularfrc';
  greeting: string | undefined;

  constructor() {}

  ngOnInit() {
    this.initializeApp();
    this.setupRemoteConfigUpdate();
  }

  async initializeApp() {
    // Initialize Firebase
    const app = initializeApp(environment.firebaseConfig);

    const remoteConfig = getRemoteConfig(app);
    
    remoteConfig.settings.minimumFetchIntervalMillis = 0;
    
    try {
      const isFetched = await fetchAndActivate(remoteConfig);
      if (!isFetched) {
        const greetingValue = getValue(remoteConfig, 'greeting');
        this.greeting = greetingValue.asString(); 
      }
    } catch (error) {
      console.error('Error fetching remote config:', error);
    }
  }

  setupRemoteConfigUpdate() {
    setInterval(async () => {
      try {
        const remoteConfig = getRemoteConfig();
        const isFetched = await fetchAndActivate(remoteConfig);
        if (!isFetched) {
          const greetingValue = getValue(remoteConfig, 'greeting');
          this.greeting = greetingValue.asString(); 
        }
      } catch (error) {
        console.error('Error fetching remote config:', error);
      }
    }, 1000); //Update Every 1 Sec Interval
  }
}
