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

  public minPartyDate: string = "";
  public maxPartyDate: string = "";
  
  constructor(private fb: UntypedFormBuilder, private partyService: PartyService, public activeModal: NgbActiveModal, @Inject(LOCALE_ID) public locale: string) {
    let today = new Date;
    this.minPartyDate = formatDate(today, 'yyyy-MM-ddTHH:mm', this.locale); // reservation minimum date is today
    today.setDate(today.getDate() + 30); // 30 day  maximum reservation
    this.maxPartyDate = formatDate(today, 'yyyy-MM-ddTHH:mm', this.locale); // must be in this 2023-01-01T13:01 FORMAT, otherwise , it will not show
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
    this.partyTimeTStr = formatDate(new Date(party.partyTime), 'yyyy-MM-ddTHH:mm', this.locale); // must be in this T FORMAT, otherwise , it will not show !
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
    this.partyTimeTStr = formatDate(new Date(value.partyTime), 'yyyy-MM-ddTHH:mm', this.locale); 
    let party: Party = {
      id: value.partyId, name: value.partyName, phone: value.phone, counts: value.numberOfPeople, partyTime: this.partyTimeTStr, notes:value.notes,
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
