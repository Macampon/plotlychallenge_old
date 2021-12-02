// Created funciton to run on page load, populating drop down and initial charts
function initLoad() {  
    d3.json("samples.json").then((data) => {
      console.log(data);
  
      // Select dropdown and create variable
      var dropdown = d3.select("#selDataset");
  
      // Create variable of names from dataset
      var names =  data.names;
      console.log(names);
      // Populate dropdown menu
      dropdown.selectAll('options')
        .data(names)
        .enter()
        .append('option')
        .attr('value', data => data)
        .text(data => data);
    
        // Store first name in dataset as variable for initial load
      var initial = names[0];   
      var filteredData = data.samples.filter(sample => sample.id == initial);
      var y = filteredData.map(otuid => otuid.otu_ids);
      console.log("FILTERED DATA : ", filteredData);
      console.log(filteredData[0].otu_ids);
      console.log("Data of otu_ids for initial load : ", y[0].slice(0, 10));    
    
      var hovertext = filteredData[0].otu_labels;
      console.log('hover is', hovertext);
    // Data for top ten OTU
      var sample = data.samples.filter(sample => sample.id == initial);
      var xbar = sample[0].sample_values.slice(0, 10);
      console.log(xbar);
      var ybar = y[0].slice(0, 10).map(String);
      ybar = ybar.map(tt => "OTU " + tt);
      console.log(ybar);
    
     
      barhovertext = hovertext.slice(0,10).reverse();
      console.log("BARhover gia:" , barhovertext)
      // Create horizontal bar plot
      var trace1 = {
        x: xbar.reverse(),
        y: ybar.reverse(),
        type: "bar",
        marker : {
          color: "pink",
        },
        text : barhovertext,
        orientation: "h"
      };
      var barData = [trace1];
      Plotly.newPlot("bar", barData);

    // Data for Bubble plot
      var idVal = filteredData[0].otu_ids;
      var sampleVal = filteredData[0].sample_values;
      console.log("ID",idVal);
      console.log("VALUES", sampleVal);
  //   // Create Bubble plot
  
      var bubbleChartTrace = {
          x: idVal,
          y: sampleVal,
          text: hovertext,
          mode: "markers",
          marker: {
            color: idVal,
            size: sampleVal,
            colorscale : 'Electric'
          }
      };

      var bubbleChartData = [bubbleChartTrace];

      var layout = {
          showlegend: false,
          height: 600,
          width: 1000,
          xaxis: {
            title: "OTU ID"
          }
      };

      Plotly.newPlot("bubble", bubbleChartData, layout);
      
      // Create demographic info card
      var demographic = data.metadata[0];
      var meta = d3.select("#sample-metadata");
      Object.keys(demographic).forEach((k) => {
      console.log("Demographic gia", demographic);
      console.log(k, demographic[k]);
       meta.append("p").attr("class", "card-text").text(`${k}: ${demographic[k]}`);
      });
      
      // Create gauge plot
      var gaugeData = [{
        domain : {x:[0,1], y:[0,1]},
        value : demographic.wfreq,
        title : {
          text : "Belly Button Washing Frequency",
          font: {
            size : 20,
            color : '#000066'
          }
        },
        mode:"gauge+number",
        type:"indicator",
        gauge:{
          axis: {
            range: [null,9],
            dtick:1,
          },
          steps: [
            { range: [0,1], color: "pink"},
            { range: [1,2], color: "lightblue"},
            { range: [2,3], color: "pink"},
            { range: [3,4], color: "lightblue"},
            { range: [4,5], color: "pink"},
            { range: [5,6], color: "lightblue"},
            { range: [6,7], color: "pink"},
            { range: [7,8], color: "lightblue"},
            { range: [8,9], color: "pink"},
          ],
          bar:{color:"purple"},
        }
      }];
      var layout = {width : 460, height: 455, margin:{t:0, b:0}};
      Plotly.newPlot("gauge",gaugeData,layout);

      // Change patient ID
      function optionChanged() {
        var id = d3.event.target.value;
        console.log("NEWID",id);
  
        // Update bar plot data
        var filteredData = data.samples.filter(sampleU => sampleU.id == id);
        var xbarU = filteredData[0].sample_values.slice(0,10);
        var ybarU = filteredData[0].otu_ids.slice(0,10);
        ybarU = ybarU.map(tt => "OTU " + tt)
        console.log("YBARU",ybarU);
        console.log("UPDATE FILTERED", filteredData);
        // Update bar plot with new data
        Plotly.restyle("bar", "x", [xbarU.reverse()]);
        Plotly.restyle("bar", "y", [ybarU.reverse()]);

        // // Update gauge plot
        // Plotly.restyle("gauge","value",[demoU[0].wfreq]);

         // Update Data for Bubble plot
        var idValU= filteredData[0].otu_ids;
        var sampleValU = filteredData[0].sample_values;
        // Update bubble plot with new data
        Plotly.restyle("bubble", "x", [idValU.reverse()]);
        Plotly.restyle("bubble", "y", [sampleValU.reverse()]);
        
        // Update demographic test ID
        var demoU = data.metadata.filter(sampleU => sampleU.id == id);
        console.log("DemoID Update",demoU[0].wfreq);
        
        
        //Update demographic card with new data
        d3.select("#sample-metadata").selectAll("p").remove();
        const meta = d3.select("#sample-metadata");
        Object.keys(demoU[0]).forEach((k) => {
          console.log('${k} : $demoU[0][k]');
        });
        for (const [k, v] of Object.entries(demoU[0])) {
          console.log(`${k}: ${v}`);
          d3.select("#sample-metadata").append("p").attr("class", "card-text").text(`${k}: ${v}`);
        };

        // Update gauge plot
        Plotly.restyle("gauge","value",[demoU[0].wfreq]);
        
      };

    //   Activate dropdown list
    dropdown.on("change",optionChanged);
    });
  };
  // Run initLoad function on page load
initLoad();