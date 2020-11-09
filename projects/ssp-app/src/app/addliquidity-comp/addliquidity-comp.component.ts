import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import BigNumber from 'bignumber.js';
import { BootService } from '../services/boot.service';

export enum ApproveStatus {
    None, Approved, NoApproved
}

export enum LoadStatus {
    None, Loading, Loaded
}

@Component({
    selector: 'app-addliquidity-comp',
    templateUrl: './addliquidity-comp.component.html',
    styleUrls: ['./addliquidity-comp.component.scss']
})
export class AddliquidityCompComponent implements OnInit {

    amts: Array<number>;

    approveStatus: ApproveStatus[];

    loadStatus: LoadStatus = LoadStatus.None;

    @Output() loading: EventEmitter<any> = new EventEmitter();
    @Output() loaded: EventEmitter<any> = new EventEmitter();

    constructor(public boot: BootService) {
        this.amts = new Array<number>();
        this.approveStatus = new Array();
        for (let i = 0; i < this.boot.coins.length; i++) {
            this.amts.push(0);
            this.approveStatus.push(ApproveStatus.None);
        }
        this.updateApproveStatus();
        this.boot.walletReady.subscribe(res => {
            this.updateApproveStatus();
        });
    }

    ngOnInit(): void {
    }

    // approve() {
    //     this.status = ActionStatus.Approving;
    //     let pArr = new Array();
    //     this.amts.forEach(e => {
    //         if (e) {
    //             pArr.push(this.boot.approve(0, String(e ? e : 0)));
    //         }
    //     });
    //     Promise.all(pArr).then(rArr => {
    //         this.status = ActionStatus.Approved;
    //     });
    // }
    updateApproveStatus() {
        for (let i = 0; i < this.boot.coins.length; i++) {
            if (this.boot.accounts && this.boot.accounts.length > 0) {
                this.boot.allowance(i).then(amt => {
                    if (amt.comparedTo(new BigNumber(this.amts[i])) >= 0) {
                        this.approveStatus[i] = ApproveStatus.Approved;
                    } else {
                        this.approveStatus[i] = ApproveStatus.NoApproved;
                    }
                });
            }
        }
    }
    approve(i: number) {
        this.loadStatus = LoadStatus.Loading;
        this.loading.emit();
        this.boot.approve(i, String(this.amts[i] ? this.amts[i] : 0)).then(r => {
            this.updateApproveStatus();
            this.loadStatus = LoadStatus.Loaded;
            this.loaded.emit();
        });
    }

    addLiquidity() {
        this.loadStatus = LoadStatus.Loading;
        this.loading.emit();
        let amtsStr = new Array<string>();
        this.amts.forEach((e, i) => {
            if (e > 0 && !this.isApproveEnabled(i)) {
                amtsStr.push(String(e));
            } else { // 
                amtsStr.push('0');
            }
        });
        this.boot.addLiquidity(amtsStr).then(r => {
            this.updateApproveStatus();
            this.loadStatus = LoadStatus.Loaded;
            this.boot.loadData();
            this.loaded.emit();
        });
    }

    isApproveEnabled(i: number) {
        if (this.boot.accounts && this.boot.accounts.length > 0 && this.approveStatus[i] === ApproveStatus.NoApproved) {
            return true;
        } else {
            return false;
        }
    }

    isAddLiquidityBtnEnabled() {
        let r = true;
        this.boot.poolInfo.coinsBalance.forEach(e => {
            r = r && (e.comparedTo(0) === 0);
        });
        if (r) { // 池中余额全部为0
            let re = true;
            this.amts.forEach((e, i) => {
                let amt = new BigNumber(e);
                re = re && !this.isApproveEnabled(i) && amt.comparedTo(0) > 0;
            });
            return re;
        } else {
            let allAmtIs0 = true;
            this.amts.forEach(e => {
                let n = new BigNumber(e);
                allAmtIs0 = allAmtIs0 && (n.isNaN() || n.comparedTo(0) === 0);
            });
            if (allAmtIs0) {
                return false;
            } else {
                let re = false;
                this.amts.forEach((e, i) => {
                    let n = new BigNumber(e);
                    if (n.isNaN() || n.comparedTo(0) === 0 || this.isApproveEnabled(i)) {

                    } else {
                        re = true;
                    }
                });
                return re;
            }
        }
    }
    connectWallet() {
        this.boot.connectWallet();
    }
    amtChange(i: number, val: any) {
        this.amts[i] = val;
        this.updateApproveStatus();
    }
}