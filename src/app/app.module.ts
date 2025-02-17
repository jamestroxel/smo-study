import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { DeliveryMethodsTableComponent } from './delivery-methods-table/delivery-methods-table.component';
import { DeliveryMethodsComponent } from './delivery-methods/delivery-methods.component';
import { FinancialChallengesTableComponent } from './financial-challenges-table/financial-challenges-table.component';
import { FinancialChallengesComponent } from './financial-challenges/financial-challenges.component';
import { ImprovedServicesTableComponent } from './improved-services-table/improved-services-table.component';
import { ImprovedServicesComponent } from './improved-services/improved-services.component';
import { MaterialModule } from './material.module';
import { MealOptionsTableComponent } from './meal-options-table/meal-options-table.component';
import { MealOptionsComponent } from './meal-options/meal-options.component';
import { MealPatternsTableComponent } from './meal-patterns-table/meal-patterns-table.component';
import { MealPatternsComponent } from './meal-patterns/meal-patterns.component';
import { MealSitesTableComponent } from './meal-sites-table/meal-sites-table.component';
import { MealSitesComponent } from './meal-sites/meal-sites.component';
// import { MealServiceSankeyComponent } from './meal-service-sankey/meal-service-sankey.component';
import { OperationsTableComponent } from './operations-table/operations-table.component';
import { OperationsComponent } from './operations/operations.component';
// import { ProgramRaceComponent } from './program-race/program-race.component';
import { ParticipationTableComponent } from './participation-table/participation-table.component';
import { ParticipationComponent } from './participation/participation.component';
import { SankeyComponent } from './sankey/sankey.component';
import { ServiceTableComponent } from './service-table/service-table.component';
import { ServiceComponent } from './service/service.component';
import { SummerParticipationTableComponent } from './summer-participation-table/summer-participation-table.component';
import { SummerParticipationComponent } from './summer-participation/summer-participation.component';

@NgModule({
    declarations: [
        AppComponent,
        SankeyComponent,
        OperationsComponent,
        ServiceComponent,
        SankeyComponent,
        ParticipationComponent,
        ParticipationTableComponent,
        OperationsTableComponent,
        ServiceTableComponent,
        FinancialChallengesComponent,
        FinancialChallengesTableComponent,
        MealSitesComponent,
        MealSitesTableComponent,
        DeliveryMethodsComponent,
        DeliveryMethodsTableComponent,
        MealOptionsComponent,
        MealOptionsTableComponent,
        MealPatternsComponent,
        MealPatternsTableComponent,
        ImprovedServicesComponent,
        ImprovedServicesTableComponent,
        SummerParticipationComponent,
        SummerParticipationTableComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MatCardModule,
        MatNativeDateModule,
        MatSidenavModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatButtonToggleModule,
        MatIconModule,
        ReactiveFormsModule,
        MaterialModule,
        MatTooltipModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
