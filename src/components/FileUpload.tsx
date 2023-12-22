import parseFile from "./parseTournFile";
import generateCsv from "./generateCsv";
import React, { useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { MuiFileInput } from 'mui-file-input';
import "./table.css";

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [clubData, setClubData] = useState<any>([]);
  const [seperate, setSeperate] = useState<boolean>(false);
  const [debatePool, setDebatePool] = useState<string>("Debate Judges");
  const [iePool, setIEPool] = useState<string>("IE Judges");
  const changeHandler = (newFile: any) => {
    setSelectedFile(newFile);
    setIsSelected(true);
    handleSubmission(newFile, seperate);
  };

  async function genCsv() {
    generateCsv(clubData);
  }
  async function handleSubmission(newFile: File | null, isSeperate: boolean) {
    if (!newFile) {
      return;
    }
    const data = await parseFile(newFile, isSeperate, debatePool, iePool);
    setClubData(data);
  }
  async function handleChange(event: any) {
    const newVal: boolean = event.target.value === "true" ? true : false
    setSeperate(newVal);
    if (selectedFile) {
      handleSubmission(selectedFile, newVal);
    }
  }

  return (
    <div style={{padding:"20px", margin:"40px"}}>
      <h2>CCA Tournament File Tool</h2>
      <p>{"Export file from Tabroom Tournament -> Entries -> Data -> Export Tabroom Data -> Entire Tournament"}</p>
      <div>
        <MuiFileInput placeholder="Select Tournament File" value={selectedFile} onChange={changeHandler} />
      </div>
      <br />


      <TextField
      style={{marginRight: "4px"}}
        id="outlined-basic" label="Debate Judge Pool" variant="outlined"
        value={debatePool}
        onChange={(e) => setDebatePool(e.target.value)}
        />
      <TextField id="outlined-basic" label="IE Judge Pool" variant="outlined"
          value={iePool}
          onChange={(e) => setIEPool(e.target.value)}
        />
      <br />
      <br />
      <div >
      <Button style={{marginRight: "4px"}} disabled={!clubData || clubData.length === 0 || !selectedFile} variant="contained" onClick={() => handleSubmission(selectedFile, seperate)}>Process Again</Button>
        <Button  disabled={!clubData || clubData.length === 0} variant="contained" onClick={genCsv}>Download Spreadsheet</Button>
      </div>
      <br />
      {clubData && clubData.length > 0 && (
        <table>
          <tbody>
            <tr>
              <th>{"Club"}</th>
              <th>{"Family"}</th>
              <th>{"Fee"}</th>
              <th>{"IE Judges"}</th>
              <th>{"Debate Judges"}</th>
              <th>{"Judge Names"}</th>
            </tr>
            {clubData.map((club: any, clubIndex: number) => {
              return club.families.map((family: any, index: number) => {
                return (
                  <tr key={index} style={{backgroundColor: clubIndex % 2 === 0 ? "#d3d3d3" : "#FFFFFF"}}>
                    <td><span>{club.name}</span></td>
                    <td>{family.name}</td>
                    <td>{`$${family.fee}`}</td>
                    <td
                      style={{
                        backgroundColor: family.regIE < family.famIE ? "#fbf719" : "#d3d3d3"
                      }}>
                      {`${family.regIE} of ${family.famIE}`}
                    </td>
                    <td
                      style={{
                        backgroundColor: family.regDebate < family.famDebate ? "#fbf719" : "#d3d3d3"
                      }}>
                      {`${family.regDebate} of ${family.famDebate}`}
                    </td>
                    <td>{family.judges}</td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

/*
<div>
  <FormControl>
  <FormLabel id="demo-controlled-radio-buttons-group">Speech and debate judges seperate people?</FormLabel>
  <RadioGroup
    aria-labelledby="demo-controlled-radio-buttons-group"
    name="controlled-radio-buttons-group"
    value={seperate}
    onChange={handleChange}
  >
    <FormControlLabel value={true} control={<Radio />} label="Yes" />
    <FormControlLabel value={false} control={<Radio />} label="No" />
  </RadioGroup>
  </FormControl>
</div>
*/
