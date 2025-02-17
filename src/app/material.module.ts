import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
    imports: [MatRadioModule, MatSidenavModule, MatButtonModule],
    exports: [MatRadioModule, MatSidenavModule, MatButtonModule],
    providers: [],
})
export class MaterialModule {}
