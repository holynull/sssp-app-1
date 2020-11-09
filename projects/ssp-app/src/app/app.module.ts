import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppLibModule } from 'app-lib';
import { AddliquidityCompComponent } from './addliquidity-comp/addliquidity-comp.component';
import { AddlpConfirmComponent } from './addlp-confirm/addlp-confirm.component';
import { AppComponent } from './app.component';
import { ChooseWalletDlgComponent } from './choose-wallet-dlg/choose-wallet-dlg.component';
import { IntallWalletDlgComponent } from './intall-wallet-dlg/intall-wallet-dlg.component';
import { PoolInfoComponent } from './pool-info/pool-info.component';
import { RedeemConfirmComponent } from './redeem-confirm/redeem-confirm.component';
import { RedeemliquidityCompComponent } from './redeemliquidity-comp/redeemliquidity-comp.component';
import { SwapCompComponent } from './swap-comp/swap-comp.component';
import { SwapConfirmComponent } from './swap-confirm/swap-confirm.component';
import { UnsupportedNetworkComponent } from './unsupported-network/unsupported-network.component';


@NgModule({
    declarations: [
        AppComponent,
        PoolInfoComponent,
        IntallWalletDlgComponent,
        SwapCompComponent,
        AddliquidityCompComponent,
        RedeemliquidityCompComponent,
        UnsupportedNetworkComponent,
        ChooseWalletDlgComponent,
        SwapConfirmComponent,
        RedeemConfirmComponent,
        AddlpConfirmComponent
    ],
    imports: [
        BrowserModule,
        AppLibModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatButtonModule,
        MatSlideToggleModule,
        FormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateModule,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}