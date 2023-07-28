import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';
import { Party } from '../models/party';

/**
 * A service to use Angular localStorage Api
 * to simulate DB CRUD operations
 * Local storage is client-side storage for web applications. 
 */
@Injectable({
  providedIn: 'root',
})
export class PartyService {
  constructor(@Inject(LOCALE_ID) public locale: string) {
  }
  // delete all the parties
  clearParties() {
      localStorage.removeItem('party');
  }
  // add a new party reservation
  addParty(party: Party) {
    // get all existing parties
    let parties: Party[] = this.getParties();
    // check DUPLICATE
    const dups = parties.filter((a) => a.name == party.name);
    if (dups.length > 0) {
      alert(`Party Name = ${party.name} is already taken, please type a new one.`);
      return;
    }

    // find the new/max id number
    let newId: number = this.getNewId(parties);
    let newParty: Party = {
      id: newId, name: party.name, phone: party.phone, counts: party.counts, partyTime: party.partyTime, notes:party.notes,
      birthday: party.birthday, vip: party.vip, privateRoom: party.privateRoom, fullFilled: party.fullFilled
    };
    parties.push(newParty);
    // save into storage for all the parties
    localStorage.setItem('party', JSON.stringify(parties));
    return;
  }

  // update one party reservation
  updateParty(party: Party) {
    // get all existing parties
    let parties: Party[] = this.getParties();
    // find the party index
    var foundIndex = parties.findIndex(x => x.id == party.id);
    parties[foundIndex] = party;
    // save into storage for all the parties
    localStorage.setItem('party', JSON.stringify(parties));
    return;
  }

  // get a new party ID by adding 1 to the maximum one
  getNewId(parties: Party[]) {
    if (parties == null || parties.length == 0)
      return 1;
    // find the max ID
    const ids = parties.map((a) => a.id)
    const maxId = Math.max(...ids);
    
    return maxId + 1;
  }

  // get all the parties
  getParties() {
    let parties: any = localStorage.getItem('party');
    let emptyParties: Party[] = [];
    //alert('getParties : ' + parties);
    if (parties == null)
      return emptyParties;
    return (JSON.parse(parties));
  }

  // get a party by ID
  getParty(partyId: number) {
    // get all existing parties
    let parties: Party[] = this.getParties();
    // find the party
    var foundIndex = parties.findIndex(x => x.id == partyId);
    return parties[foundIndex];;
  }

  // delete/cancel a party reservation by filtering out the party by ID
  deleteParty(party: Party) {
    // get all existing parties
    let parties: Party[] = this.getParties();
    parties = parties.filter(p => p.id !== party.id);
    // save into storage for the updated parties
    localStorage.setItem('party', JSON.stringify(parties));
    return;
  }

  // Fixtures : load simulated parties data for testing
  setSampleData() {
    let PARTIES: Party[];

    var tomorrow6pm = new Date();
    tomorrow6pm.setDate(tomorrow6pm.getDate() + 1);
    tomorrow6pm.setHours(18);
    let partyTime = formatDate(tomorrow6pm, 'yyyy-MM-ddTHH:mm', this.locale); // must be in this 2023-01-01T13:01 FORMAT, otherwise , it will not show

    PARTIES = [
      {
        id: 1,
        name: "Walter's party",
        phone:"813-784-1102",
        counts: 10,
        partyTime: partyTime,
        notes: "Happy Father's day",
        birthday: false,
        vip: true,
        privateRoom: false,
        fullFilled: false,
      },
      {
        id: 2,
        name: "Lily's party",
        phone: "727-669-4368",
        counts: 20,
        partyTime: partyTime,
        notes: "Happy Birthday",
        birthday: true,
        vip: false,
        privateRoom: false,
        fullFilled: false,
      },
      {
        id: 3,
        name: "Steve's party",
        phone: "727-354-4368",
        counts: 40,
        partyTime: partyTime,
        notes: "Happy mother's day",
        birthday: false,
        vip: false,
        privateRoom: true,
        fullFilled: false,
      },

    ];
    // save to local storage
    localStorage.setItem('party', JSON.stringify(PARTIES));
  }

}
