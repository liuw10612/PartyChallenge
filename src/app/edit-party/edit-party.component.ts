import { Component, Input, OnInit, Inject,  LOCALE_ID} from '@angular/core';
import { formatDate } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PartyService } from 'src/app/Services/party.service';
import { Party } from 'src/app/models/party';

@Component({
  selector: 'edit-party',
  templateUrl: './edit-party.component.html',
  styleUrls: ['./edit-party.component.css']
})
export class EditPartyComponent implements OnInit {
  @Input() partyId!: number;

  constructor(private fb: UntypedFormBuilder, private partyService: PartyService, public activeModal: NgbActiveModal, @Inject(LOCALE_ID) public locale: string) {
  }

  public partyTimeTStr = formatDate(new Date(), 'yyyy-MM-ddTHH:mm', this.locale); // must be in this FORMAT, otherwise , it will not show
  partyForm: UntypedFormGroup = this.fb.group({
    'partyId': [-1],
    'partyName': ['', Validators.required],
    'phone': ['', Validators.pattern('[- +()0-9]{10,12}')],
    'numberOfPeople': [1],
    'partyTime': [this.partyTimeTStr],
    'notes':[],
    'birthday': [false],
    'vip': [false],
    'privateRoom': [false],
    'fullFilled': [false],
  })

  ngOnInit() {
    if (this.partyId < 0 ) { // add
      return;
    };
    let party = this.partyService.getParty(this.partyId);
    this.partyTimeTStr = formatDate(new Date(party.partyTime), 'yyyy-MM-ddTHH:mm', this.locale); // must be in this FORMAT, otherwise , it will not show
    this.partyForm = this.fb.group({
      'partyId': [party?.id],
      'partyName': [party?.name],
      'phone': [party?.phone],
      'numberOfPeople': [party?.counts],
      'partyTime': [this.partyTimeTStr],
      'notes': [party?.notes],
      'birthday': [party.birthday],
      'vip': [party.vip],
      'privateRoom': [party.privateRoom],
      'fullFilled': [party.fullFilled],
    })
  }

  onSubmit(): void {
    if (!this.partyForm.valid) {
      alert('Invalid party details, please correct before saving.');
      return;
    }
    var value = this.partyForm.getRawValue();
    console.log(value);
    let partyTimeStr = new Date(value.partyTime).toString();
    let party: Party = {
      id: value.partyId, name: value.partyName, phone: value.phone, counts: value.numberOfPeople, partyTime: partyTimeStr, notes:value.notes,
      birthday: value.birthday, vip: value.vip, privateRoom: value.privateRoom, fullFilled: value.fullFilled
    };
    if (value.partyId<0) // Add
      this.partyService.addParty(party);
    else // Update
      this.partyService.updateParty(party);

    alert('party saved successfully...\nPlease click Ok to continue.');
    this.activeModal.close('Success');
  }
}
