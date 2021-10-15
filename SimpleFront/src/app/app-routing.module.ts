import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LvlOneChildComponent } from './components/lvl-one-child/lvl-one-child.component';
import { RootComponent } from './components/root/root.component';
import { DataResolverService } from './resolvers/data-resolver.service';


const routes: Routes = [
  {
    path: 'root',
    component: RootComponent,
    resolve: {
      dataResolver: DataResolverService
    },
    children: [
      {
        path: 'lvl-one-child',
        component: LvlOneChildComponent
      },
      { path: '',
        redirectTo: 'lvl-one-child',
        pathMatch: 'full'
      }
    ]
  },
  { path: '',
    redirectTo: '/root',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
