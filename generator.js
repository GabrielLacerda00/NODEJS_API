// Require the csv module
import generate from 'csv-generate'
// Print 10 records
generate({length: 10}).pipe(process.stdout)
