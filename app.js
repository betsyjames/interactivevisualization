//function to display the data in the metadata panel
function getMetaData(sample) {
    //get the metadata
     d3.json("data/samples.json").then((data) => {
     var metadata = data.metadata;
     
      // Filter the data based on id
      var filterData = metadata.filter(sampleObject => sampleObject.id == sample);
      console.log(filterData);
      var filterDataResult = filterData[0];

      // Select the panel 
      var metaDataPanel = d3.select("#sample-metadata");
  
      // Clear existing data
      metaDataPanel.html("");
  
      Object.entries(filterDataResult).forEach(([key, value]) => {
        metaDataPanel.append("h6").text(`${key}: ${value}`);
      }); 
      
    });
  }

//function to create a horizontal bar chart and bubble chart using otu_ids
function otuGraphs(sample){
  //get the samples
  d3.json("data/samples.json").then((data) => {
    var samples = data.samples;
    
    // Filter the data based on id
    var filterData = samples.filter(sampleObject => sampleObject.id == sample);
    var filterDataResult = filterData[0];
    console.log(filterDataResult);

    //Get otu_ids from each id from samples.json
    var otu_ids = filterDataResult.otu_ids;
    console.log(otu_ids);
    var otu_labels = filterDataResult.otu_labels;
    var sample_values = filterDataResult.sample_values;

    //Get the top 10 otu_ids for each id
    var slicedData = otu_ids.slice(0,10);
    var reversedData = slicedData.reverse();

    //Trace1 for top 10 otu_ids
    var trace1 ={
      x:sample_values.slice(0, 10).reverse(),
      y:reversedData.map(object => `OTU ${object}`),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation:"h"
    };
  
    var data = [trace1];

    // Apply the group bar mode to the layout
   var layout = {
    title: "Top 10 OTUs", 
    margin: {
      l: 140,
      r: 100,
      t: 40,
      b: 100
    }
  };

  Plotly.newPlot("bar", data, layout);

 //Plot Bubble chart
  var trace2 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }

  };

  var layout2 ={
    title: "Bacteria Cultures Per Sample",
    xaxis: { title: "OTU ID" },
    margin: { t: 30}
  };

  var data2 = [trace2];

  Plotly.newPlot("bubble", data2, layout2);
});
}


//function that keeps track of drop down selection and initialize the dashboard
function init() {
    // Assign the value of the dropdown menu option to a variable
    var dropdown = d3.select("#selDataset");
  
    // Populate the drop down value using the names from data.json
    d3.json("data/samples.json").then((data) => {
        //get the names from data.json file
      var sampleNames = data.names;
        //append each of the options to the drop down
      sampleNames.forEach((sample) => {
        dropdown.append("option").text(sample).property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      //buildCharts(firstSample);
      getMetaData(firstSample);
      otuGraphs(firstSample);
    });
  };
  function optionChanged(newSampleData) {
    // Fetch new data each time a new id is selected
    getMetaData(newSampleData);
    otuGraphs(newSampleData);
  };



// Initialize the dashboard
init();