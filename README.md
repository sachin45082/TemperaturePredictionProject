# TemperaturePredictionProject

## Global Temperature Trends and Impact of CO2 and Deforestation on Temperature Change

### DESCRIPTION: 
The project will utilize ARIMA/SARIMA model to predict temperature for the next 30 years from historical data. Then the project is extended to use Artificial Neural Network model to identify the relationship between CO2 and/or Forest Area on the changes of temperature. We used the below tools and packages for the project
- Jupyter Lab - as IDE
- Pandas / Numpy - For reading data and data processing 
- Matplotlib / Seaborn - For plots
- Plotly - For world map
- Statsmodel / pmdarima - For ARIMA / SARIMAX model
- Sklearn - For model evaluations, data scaling and train-test split etc.
- Tensorflow - For ANN model
- D3 - For more advanced interactive maps
- Tableau - For other charts and plots


### INSTALLATION:
Preparing the environment:
- Datasets - CO2 and Forest dataset is available in the Repo. Please download the Global Teperature by city dataset using below link and place it under "/CODE/ML Model/source".
	https://www.kaggle.com/datasets/berkeleyearth/climate-change-earth-surface-temperature-data
- Model Execution - Download conda and open conda command prompt. Create new conda environment using the env.yml provided in the team109final.zip file using the below command. "env.txt" has all the modules and setup that need to be done for the environment setup.  - 
	+ conda env create -f env.yml
- D3 Visualization : Copy the files produced by the Model Execution to folder (~relativePath/D3 Viz/data) if you would like to run the models for all countries(it might take a day). *** Final output from Model Execution for all the countries is already exported and copied into data folder to run vizulations
- Tableau: The 2 visualization views developed in Tableau are published to Tableau Public and can be accessed through the following links.
	+ Visualization 1 using ARIMA Prediction Model output -  https://public.tableau.com/app/profile/gopi.chava/viz/Project_TableauViz-1_Team109/ARIMAPredictionViz
	+ Visualization 2 using ANN Prediction Model output - https://public.tableau.com/app/profile/gopi.chava/viz/Project_TableauViz-2_Team109/ANNPredictionViz
Just opening the above links in a browser will show the visualizations which can be updated interactively as explained under execution section below for Tableau.

### EXECUTION:

NOTE : The Notebook will take more than a day to train the models if executed for all countries. So, It is configured to run for US only currently. Please follow the steps mentioned below properly to run for all countries.

Setting up the code:
Before running the models:
 - In the notebook, at the top there is the reference of all the main parts of the notebook.
	 + For ARIMA/SARIMAX model, 
		- By default, the selection is only one country, "United State".
		- Users can select to run the model with all the countries in "Population Selection" section.
	+ For ANN model:
		- By default, the selection is only one country, "United State".
		- Users can select to run the model with all the countries in "Population Selection" section.

Jupyter Notebook:
- Run for the entire notebook:
	+ Select "Cell" tab -> Choose "Run All" option.

- Run for City Temperature Data Exploration:
	1. Run the "Environment Preparation" section
	2. Go down to "Read Temperature Dataset", run all the cells to read and run basic data processing 
	3. Run "Data Exploration for Raw Data" section

- Run for ARIMA model:
	1. Run the "Environment Preparation" section
	2. Go down to "Read Temperature Dataset", run all the cell to read and run basic data processing
	2. From "Notebook Reference", go to "Data Cleaning for City Temperature Dataset" section
	3. Run all the cells in "Data Cleaning for City Temperature Dataset" section
	4. Go down to "ARIMA" model section
	5. Run the first two cells to prepare data and create the model function
	6. In "Population Selection" section, choose either running for a set of countries or all countries by comment out either cell
	7. If running for all countries, Please uncomment below lines under 'Run the Model' cell.
		arima_output_rs.to_csv('final_output/arima_model_output.csv', index=False) 
		arima_all_output.to_csv('final_output/arima_model_output.csv', mode='a', header=False)
		AND
		comment below - 
			arima_output_rs.to_csv('us_output/arima_model_output_us.csv', index=False) 
			arima_all_output.to_csv('us_output/arima_model_output_us.csv', mode='a', header=False)
			

	8. Go down to "Run Model" section and run the cell start running the model and get the output
	+ Note:
		- ARIMA model runtime is at least 7-8 minutes for a country
		- The output file will be created in the directory where the notebook located

- Run for Artificial Neural Networks model:
	1. Run the “Environment Preparation” to import all the required modules.
	3. Go down to "Read Temperature Dataset", run all the cell to read and run basic data processing
	4. From "Notebook Reference", go to "Data Cleaning for City Temperature Dataset" section
	5. Run all the cells in "Data Cleaning for City Temperature Dataset" section
	6. Go to "Data Preparation and Analyzation for Two Sub-Datasets" and run all the cells in the section including subsections
	7. Go down to "Artificial Neural Networks" model section
	8. Run the first three cells to prepare and create the model function
	9. In "Population Selection" section, 
		6.1. Run the first cell to identify extreme countries.
		6.2. Choose either running for a set of countries or all countries by comment out either 2nd or 3rd cell.
	10. Go down to "Run Model" section and run all the cells to start running the model and get the output
	+ Note:
		- The extreme countries are the countries that return the temperature that is wrong from interpretation.
		- The output file will be created in the directory where the notebook located. Please uncomment below line in 2nd cell under "Run the Model" section if running for all countries.
			CO2_Forest_Resultset.to_csv('final_output/neural_net_output.csv') 
		and comment below.
			CO2_Forest_Resultset.to_csv('us_output/sample_neural_net_output_us.csv') 

D3:
	1. Start simple HTTP server by running this command in the project diroctory(~relativePath\team109final\CODE)
		python -m http.server 8000
	2. Run vizulations in the browser 
		- Average Temprature (http://localhost:8000/D3%20Viz/Map.html)
		- Change in Temprature (http://localhost:8000/D3%20Viz/TempChange.html)
		- Predicted temprature difference based on CO2 and Forest area change (http://localhost:8000/D3%20Viz/Map%20_Co2_Def.html)
	3. Change dropdown options to see the change in map 

Tableau:
After opening the visualization views using the links provided above, users can interact with the visualization through date sliders and filter options as explained below.

For visualization 1, the view displays the average temperature for most countries using the ARIMA prediction model output. The range of available data is from 1886 to 2043. Users can interact with this visualization by using the date slider to move to the year of interest and observe the temperature change. Alternatively, the slider can be dragged along slowly to observe the temperature change over time.

For visualization 2 that displays ANN model output to observe temperature for different combinations of CO2 emissions and Forest area change, the user can interactively select different options for CO2 emissions and Forest area change percent and observe the impact on global temperature. The user can use this approach to see the temperature change effect compared to the base case values of CO2 emissions and forest area. The selection of "All" for any of these paramters will show a matrix of plots.


