public with sharing class PECSVFileReadLWCCntrl {
    @AuraEnabled
    public static list<Pricing_Exhibit__c> csvFileRead(Id contentDocumentId, Id oppId){
        system.debug('oppId >>>' + oppId);
        list<Pricing_Exhibit__c> peInsertList = new list<Pricing_Exhibit__c>();
        if(contentDocumentId != null) {
            // Fetch File Data based on the basic of document id 
            ContentVersion contentVersionObj = [SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId =:contentDocumentId];
            // split the file data
            
            Opportunity opp = new Opportunity();
            opp = [SELECT Id, AccountId FROM Opportunity WHERE Id =: oppId];
            
            String stringContent = contentVersionObj.VersionData.toString();
            stringContent = stringContent.replaceAll('\r\n', '\n');
            
            system.debug('stringContent >>>' + JSON.serialize(stringContent));
            
            list<String> csvRecordsList = stringContent.split('\n');
            
            for(Integer i = 1; i < csvRecordsList.size(); i++){
                Pricing_Exhibit__c peObj = new Pricing_Exhibit__c();
                list<String> csvRowData = csvRecordsList[i].split(',');
                System.debug('csvRowData====>'+csvRowData);
                System.debug('csvRowData[21] tier 15====>'+JSON.serialize(csvRowData[21]));
                
                peObj.Opportunity__c = oppId;
                peObj.Account__c = opp.AccountId;
                peObj.Product_Description__c = csvRowData[0]; 
                peObj.Model__c = csvRowData[1]; 
                peObj.List_Price__c = Decimal.valueOf(csvRowData[2]); 
                peObj.C_Codes__c = csvRowData[3]; 
                peObj.Contract_Price__c = Decimal.valueOf(csvRowData[4]); 
                peObj.Contracting_Type__c = csvRowData[5]; 
                peObj.Status__c = csvRowData[6]; 
                
                peObj.Tier_1__c = Decimal.valueOf(csvRowData[7]); 
                peObj.Tier_2__c = Decimal.valueOf(csvRowData[8]);  
                peObj.Tier_3__c = Decimal.valueOf(csvRowData[9]);  
                peObj.Tier_4__c = Decimal.valueOf(csvRowData[10]); 
                peObj.Tier_5__c = Decimal.valueOf(csvRowData[11]); 
                peObj.Tier_6__c = Decimal.valueOf(csvRowData[12]);  
                peObj.Tier_7__c = Decimal.valueOf(csvRowData[13]);  
                peObj.Tier_8__c = Decimal.valueOf(csvRowData[14]); 
                peObj.Tier_9__c = Decimal.valueOf(csvRowData[15]);  
                peObj.Tier_10__c = Decimal.valueOf(csvRowData[16]);  
                peObj.Tier_11__c = Decimal.valueOf(csvRowData[17]);  
                peObj.Tier_12__c = Decimal.valueOf(csvRowData[18]);  
                peObj.Tier_13__c = Decimal.valueOf(csvRowData[19]);                 
                peObj.Tier_14__c = Decimal.valueOf(csvRowData[20]);  
                peObj.Tier_15__c = Decimal.valueOf(csvRowData[21]); 
                
                peInsertList.add(peObj);
            }
            
            
            try{ 
                if(!peInsertList.isEmpty()) {
                    insert peInsertList;
                }
            }
            catch (Exception ex) {
                system.debug(ex.getStackTraceString());
                throw new AuraHandledException(ex.getStackTraceString());  //getMessage());
            } 
        }
        return peInsertList;    
    }
}