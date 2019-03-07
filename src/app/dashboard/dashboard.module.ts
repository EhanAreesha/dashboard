import { NgModule } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import {TabViewModule} from 'primeng/tabview';
import {CardModule} from 'primeng/card';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AccordionModule,
    TabViewModule,
    CardModule
  ],
  providers: [MessageService, ConfirmationService, DashboardService]
})
export class DashboardModule {
  constructor() {
  }

}
