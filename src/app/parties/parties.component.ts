import { Component,  } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PartyService } from '../services/party.service';
import { Party } from '../models/party';
import { EditPartyComponent } from '../edit-party/edit-party.component';


@Component({
  selector: 'parties',
  templateUrl: './parties.component.html',
  styleUrls: ['./parties.component.css']
})
export class PartiesComponent  {
  public sortColumn: string = 'name';
  public ascending: boolean = true;
  public searchText: string = '';
  public parties: Party[] = [];
  public closeResult: string = '';

  constructor( private partyService: PartyService, private modalService: NgbModal) {
    // load parties from local storage if any
    this.parties = this.partyService.getParties();
    if (this.parties == null || this.parties.length < 1) { // if EMPTY load simulated data
      this.partyService.setSampleData();
      this.parties = this.partyService.getParties();
    }
  }
  // sort column
  public setSort(column: string) {
    if (this.sortColumn === column) {
      this.sortColumn = column;
      this.ascending = !this.ascending;
    } else {
      this.sortColumn = column;
      this.ascending = true;
    }
  }

  // add or edit a party by a MODAL , id=-1 for add
  public editParty(partyId: number) {
    const modalRef = this.modalService.open(EditPartyComponent, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' })
    // passing parameters to modal page
    modalRef.componentInstance.partyId = partyId;
    modalRef.result.then((result) => {
      this.closeResult = result;
      // re load parties after update
      this.parties = this.partyService.getParties()
    },
      reason => {
        this.closeResult = `Dismissed ${reason}`;
      });
  }
  // cancel/delete a party reservation
  public deleteParty(party:Party) {
    if (confirm(`Really want to cancel party : '${party.name}'?`)) {
      this.parties = this.parties.filter(p => p.id !== party.id);
      this.partyService.deleteParty(party);
    }
  }
  // clean up
  public reset() {
    if (confirm(`Are you sure to delete al the parties? Click OK to continue`)) {
      this.partyService.clearParties();
      this.parties = this.partyService.getParties();
    }
  }
  // load some sample data for testing
  public loadSampleData() {
    if (confirm(`Are you sure to re fresh data by sample testing data? Click OK to continue`)) {
      this.partyService.setSampleData();
      this.parties = this.partyService.getParties();    }
  }
}
 
