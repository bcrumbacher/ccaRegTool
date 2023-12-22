
export default async function parseFile(clubData: any) {
  let rows: any[] = [["club", "family", "fee", "IE judge requirement", "IE judges registered",
  "debate judge requirement", "debate judges registered"]];
  clubData.map((club: any) => {
    return club.families.map((family: any) => {
      rows.push([club.name, family.name, `$${family.fee}`, family.famIE, family.regIE, family.famDebate, family.regDebate])
  })
  })



  let csvData = rows.join("\n");

  const blob = new Blob([csvData], { type: 'text/csv' });

    // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob)

    // Creating an anchor(a) tag of HTML
  const a = document.createElement('a')

    // Passing the blob downloading url
    a.setAttribute('href', url)

    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute('download', 'CCATournamentFees.csv');

    // Performing a download with click
    a.click()
}
