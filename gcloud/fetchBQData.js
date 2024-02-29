import { BigQuery } from '@google-cloud/bigquery';
import addBQtFB from '../firebase/addBQtoFB.js'

const bigquery = new BigQuery();

const fetchBQData = async () => {
    
    const FBqueryIsNull = 'SELECT * FROM `hattifnatt.hattifnattDataset.siteInteracted` WHERE firebase_export IS NULL';

    const options = {
        query: FBqueryIsNull
    }
    //Running the query and adds to firestore
    const [rows] = await bigquery.query(options);

    if (rows.length === 0) {
        //do nothing
    } else {
        //add rows to firebase and change 
        //NULL to true i BQ.
        console.log("-------------- addBQtoFB!!!!! -----------------");
        await addBQtFB(rows);


        //only update in BQ when the rows have been added to firestore.
        const UPDATEquery = `
        UPDATE hattifnatt.hattifnattDataset.siteInteracted
        SET firebase_export = TRUE
        WHERE firebase_export IS NULL
        AND publish_time < TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 90 MINUTE)
        `;
//////
        const UPDATEoptions = {
            query: UPDATEquery,
            // Location must match that of the dataset(s) referenced in the query.
            //location: 'EU',
        };
//////
        // Run the query as a job
        const [update] = await bigquery.createQueryJob(UPDATEoptions);
        //
        // Wait for the query to finish
        const [updateRows] = await update.getQueryResults();
//////
        // Print the results
        console.log('Updated Rows:');
        updateRows.forEach(row => console.log(row));

    }

}


export default fetchBQData;