import os
import json
import datetime
import numpy as np
import pandas as pd
from .curve import Curve
from .plots_service import PlotService

def getHour(t):
    if pd.isna(t):
        return None
    t = int(t)
    hour = t // 100 
    return hour

def data_already_processed():
    try:
        existing_data = PlotService.get_all_curves()
        return len(existing_data) > 0
    except Exception as e:
        print(f"Error checking existing data: {e}")
        return False

def pre_process_data_func():
    if data_already_processed():
        print("Data already processed. Skipping pre-processing.")
        return
    
    print("Reading data for the first time")

    with open('./db/files-airports.json') as f:
        files_details = json.load(f)

    # Read all csv files into a list of DataFrames
    dataframes = []
    for filename in files_details['filenames']:
        if not os.path.exists(filename):
            print(f"File {filename} does not exist. Please check the path.")
        else:
            print(f"Reading file: {filename}")
            df = pd.read_csv(filename)
            dataframes.append(df)

    # Concatenate all DataFrames into one
    if not dataframes:
        print("No files to read. Please check the files.json configuration.")
        return

    curves = pd.concat(dataframes, ignore_index=True)
    
    # Parameters
    time_resolution_variable = files_details['time_resolution_variable']
    time_variable = files_details['time_variable']
    zone_variable = files_details['zone_variable']
    variables = files_details['variables']
    P = files_details['resolution']

    # Get the number of unique time_variable values
    R = 100
    N = curves[time_variable].nunique()
    Z = curves[zone_variable].nunique()  # Number of zones
    Z_mapping = {zone: i for i, zone in enumerate(curves[zone_variable].unique())}

    all_dates = curves[time_variable].unique()
    all_dates.sort()
    print("all_dates: ", all_dates)
    dates_mapping_date_to_int = {date: i for i, date in enumerate(all_dates)}

    print(f"Number of time intervals (N): {N}, Number of zones (Z): {Z}, Resolution (P): {P}")
    print("curves shape: ", curves.shape)
    print("curves columns: ", curves.columns)
    print("curves:", curves.head())

    zone_names = curves[zone_variable].unique()
    all_dates = pd.to_datetime(all_dates)
    weekdays = [d.weekday() for d in all_dates]

    # Preallocate dictionary
    C = {}

    # Loop using precomputed values
    for i in range(Z):
        zone_name = zone_names[i]
        for j in range(N):
            date = all_dates[j]
            weekday = weekdays[j]
            curve = Curve(P, j, R, variables)
            curve.zone = i
            curve.zone_name = zone_name
            curve.id = j
            curve.date = date
            curve.weekDay = weekday
            C[(i, j)] = curve

    print("Initialized curves for all zones and time intervals.")

    for i in range(len(curves)):
        id, zone, hour = curves.at[i, time_variable], curves.at[i, zone_variable], curves.at[i, time_resolution_variable]

        if hour is None or pd.isna(hour):
            print(f"Skipping curve {i + 1}/{len(curves)} due to missing hour data.")
            continue

        hour = getHour(hour) % 24
        zone = Z_mapping[zone]  # Map zone to its index
        id = dates_mapping_date_to_int[id]  # Map date to its index

        if i % 100000 == 0:
            print(f"Processing curve {i + 1}/{len(curves)}: id={id}, zone={zone}, hour={hour}")
            print(f"Type of id: {type(id)}, zone: {type(zone)}, hour: {type(hour)}")

        for var in variables:
            # if curves.at[i, var] is None or pd.isna(curves.at[i, var]), fill it with 0
            if pd.isna(curves.at[i, var]):
                curves.at[i, var] = 0.0
            C[(zone, id)].data[var][hour] += curves.at[i, var]
        C[(zone, id)].data['values'][hour] += 1

    # Salvar os dados no database
    print("Saving data to zone database")
    C = list(C.values())
    PlotService.save_curves_to_db(C)
    print("Data saved to database")