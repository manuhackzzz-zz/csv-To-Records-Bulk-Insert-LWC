import { LightningElement, track, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation';
import csvFileRead from '@salesforce/apex/PECSVFileReadLWCCntrl.csvFileRead';

const columnsPriceExhibits = [
    { label: 'Product Description', fieldName: 'Product_Description__c' }, 
    { label: 'Model', fieldName: 'Model__c' }, 
    { label: 'List Price', fieldName: 'List_Price__c' }, 
    { label: 'C-Codes', fieldName: 'C_Codes__c' }, 
    { label: 'Contract Price', fieldName: 'Contract_Price__c' }, 
    { label: 'Contracting Type', fieldName: 'Contracting_Type__c' }, 
    { label: 'Status', fieldName: 'Status__c' }, 
    { label: 'Tier 1', fieldName: 'Tier_1__c' }, 
    { label: 'Tier 2', fieldName: 'Tier_2__c' }, 
    { label: 'Tier 3', fieldName: 'Tier_3__c' }, 
    { label: 'Tier 4', fieldName: 'Tier_4__c' }, 
    { label: 'Tier 5', fieldName: 'Tier_5__c' }, 
    { label: 'Tier 6', fieldName: 'Tier_6__c' }, 
    { label: 'Tier 7', fieldName: 'Tier_7__c' }, 
    { label: 'Tier 8', fieldName: 'Tier_8__c' }, 
    { label: 'Tier 9', fieldName: 'Tier_9__c' }, 
    { label: 'Tier 10', fieldName: 'Tier_10__c' }, 
    { label: 'Tier 11', fieldName: 'Tier_11__c' }, 
    { label: 'Tier 12', fieldName: 'Tier_12__c' }, 
    { label: 'Tier 13', fieldName: 'Tier_13__c' }, 
    { label: 'Tier 14', fieldName: 'Tier_14__c' }, 
    { label: 'Tier 15', fieldName: 'Tier_15__c' }    
];

export default class PeCSVFileReadLWC extends NavigationMixin(LightningElement) {
    @api recordId;
    @track error;
    @track columnsPriceExhibits = columnsPriceExhibits;
    @track data;

    // accepted parameters
    get acceptedCSVFormats() {
        return ['.csv'];
    }
    
    uploadFileHandler(event) {
        // Get the list of records from the uploaded files
        const uploadedFiles = event.detail.files;
        console.log(this.recordId);
        // calling apex class csvFileread method
        csvFileRead({contentDocumentId : uploadedFiles[0].documentId, oppId : this.recordId})
        .then(result => {
            window.console.log('result ===> '+result);
            this.data = result;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Pricing Exhibits records are created from the CSV file upload!!!',
                    variant: 'Success',
                }),
            );
            // Navigate to the related list.
            
            this[NavigationMixin.Navigate]({
                type: 'standard__recordRelationshipPage',
                attributes: {
                    recordId: this.recordId,
                    //objectApiName: 'Opportunity',
                    relationshipApiName: 'Pricing_Exhibits__r',
                    actionName: 'view'
                },
            });
                
            /* working 
            this[NavigationMixin.Navigate]({
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: 'Pricing_Exhibit__c',
                    actionName: 'list'
                },
                state: {
                    // 'filterName' is a property on 'state'
                    // and identifies the target list view.
                    // It may also be an 18 character list view id.
                    // or by 18 char '00BT0000002TONQMA4'
                    filterName: 'Recent' 
                }
            });
            */
        })
        
        .catch(error => {
            this.error = error;
            console.log(this.error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: JSON.stringify(error),
                    variant: 'error',
                }),
            );     
        })
        
    }
}