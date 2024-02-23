const express = require("express");
const axios = require("axios");
const { parse } = require("csv-parse/sync");
const cors = require("cors");
const app = express();
app.use(cors());

async function getListOfFiles() {
  const url = "https://echo-serv.tbxnet.com/v1/secret/files";
  const headers = { Authorization: "Bearer aSuperSecretKey" };
  const response = await axios.get(url, { headers });
  return response.data.files;
}

function processCsvData(csvData) {
  try {
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });

    const validRecords = records.filter(
      (record) => record.file && record.text && record.number && record.hex
    );

    return validRecords;
  } catch (error) {
    console.error(`Error parsing CSV data:`, error.message);

    return [];
  }
}

async function downloadAndProcessFile(fileName) {
  try {
    const url = `https://echo-serv.tbxnet.com/v1/secret/file/${fileName}`;
    const headers = { Authorization: "Bearer aSuperSecretKey" };
    const response = await axios.get(url, { headers, responseType: "text" });
    if (response.data.trim().length === 0) {
      console.log(`${fileName} is empty.`);
      return null;
    }
    return processCsvData(response.data);
  } catch (error) {
    console.error(`Error downloading ${fileName}:`, error.message);
    return null;
  }
}

app.get("/files/data", async (req, res) => {
  try {
    const files = await getListOfFiles();
    const data = [];

    for (const fileName of files) {
      const fileContent = await downloadAndProcessFile(fileName);
      if (fileContent !== null) {
        data.push({
          file: fileName,
          lines: fileContent.map((line) => ({
            text: line.text,
            number: line.number,
            hex: line.hex,
          })),
        });
      } else {
        console.log(`Skipping ${fileName} due to errors.`);
        continue;
      }
    }
    const filteredData = data.filter((file) => file.lines.length > 0);

    res.json(filteredData);
  } catch (error) {
    console.error("Error getting the list of files:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(5000, () => console.log("Server running on port 5000"));
