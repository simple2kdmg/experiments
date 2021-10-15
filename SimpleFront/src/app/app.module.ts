import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';
import { AppRoutingModule } from './app-routing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { httpInterceptorProviders } from './http-interceptors';
import { AppComponent } from './app.component';
import { RootComponent } from './components/root/root.component';
import { LvlOneChildComponent } from './components/lvl-one-child/lvl-one-child.component';
import { LvlOneChildContentComponent } from './components/lvl-one-child-content/lvl-one-child-content.component';
import { KpiToolbarModule } from './components/kpi-toolbar/kpi-toolbar.module';
import { DataResolverService } from './resolvers/data-resolver.service';


@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    LvlOneChildComponent,
    LvlOneChildContentComponent
  ],
  imports: [
    SharedModule,
    AppRoutingModule,
    NoopAnimationsModule,
    KpiToolbarModule
  ],
  providers: [
    httpInterceptorProviders,
    DataResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
