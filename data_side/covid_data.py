from pandas import read_csv
import matplotlib.pyplot as plt
from datetime import datetime
from matplotlib.dates import date2num
from os.path import isdir, join
from os import mkdir
from getpass import getuser


_base_directory = '/users/{user}/projects/covid/data_side/graph_output/{state}/'


def get_directory(directory_path, state, filename):
    directory_path = directory_path.format(user=getuser(), state=state)
    if not isdir(directory_path):
        mkdir(directory_path)
    return join(directory_path, filename)


def subset_state(state):
    # retrieves data from api, subsets by specified state
    state = state.upper()
    print("Running process for {}".format(state))
    stat = read_csv(r"https://covidtracking.com/api/v1/states/daily.csv")
    if state != 'USA':
        stat = stat[stat['state'] == state].copy()
    else:
        stat = stat.groupby('date').sum()
        stat.reset_index(inplace=True)
    stat['date'] = stat['date'].map(lambda x: datetime.strptime(str(x), '%Y%m%d'))
    stat['date_plt'] = date2num(stat['date'].tolist())
    max_date = str(stat['date'].max()).split(" ")[0]
    # removes negative values but keeps missing values
    for col in ['positive', 'death', 'positiveIncrease', 'totalTestResultsIncrease', 'deathIncrease']:
        stat = stat.loc[(stat[col] >= 0) | (stat[col].isnull())]
    print("Latest data from: {}".format(max_date))
    return stat


def plot_state_data(state, roll=7):
    # plots state data
    state = state.upper()

    stat = subset_state(state)

    # cumulative cases
    plt.plot(stat['date'], stat['positive'])
    plt.gcf().autofmt_xdate()
    plt.title("Cumulative Cases for {}".format(state))
    plt.xlabel("Date")
    plt.ylabel("Total Cases")
    figure_name = get_directory(_base_directory, state, '{state}_cumulative_cases.png'.format(state=state))
    plt.savefig(fname=figure_name, format='png')
    plt.clf()

    # cumulative deaths
    plt.plot(stat['date'], stat['death'])
    plt.gcf().autofmt_xdate()
    plt.title("Cumulative Deaths for {}".format(state))
    plt.xlabel("Date")
    plt.ylabel("Total Deaths")
    figure_name = get_directory(_base_directory, state, '{state}_cumulative_deaths.png'.format(state=state))
    plt.savefig(fname=figure_name, format='png')
    plt.clf()

    # ratio of new cases to new tests
    plt.plot(stat['date'], (stat['positiveIncrease'] / stat['totalTestResultsIncrease']).rolling(roll).mean(), c='g')
    plt.gcf().autofmt_xdate()
    plt.title("{state} Ratio of New Cases to New Tests ({roll}-day rolling mean)".format(state=state, roll=roll))
    plt.xlabel("Date")
    plt.ylabel("New Case / New Tests")
    figure_name = get_directory(_base_directory, state, '{state}_cases_to_tests_ratio.png'.format(state=state))
    plt.savefig(fname=figure_name, format='png')
    plt.clf()

    # new cases
    plt.plot(stat['date'], stat['positiveIncrease'].rolling(roll).mean(), c='r')
    plt.plot(stat['date'], stat['positiveIncrease'], c='r', alpha=.25)
    plt.gcf().autofmt_xdate()
    plt.title("{state} New Cases ({roll}-day rolling mean)".format(state=state, roll=roll))
    plt.xlabel("Date")
    plt.ylabel("New Case")
    figure_name = get_directory(_base_directory, state, '{state}_new_cases_per_day.png'.format(state=state))
    plt.savefig(fname=figure_name, format='png')
    plt.clf()

    # new tests
    plt.plot(stat['date'], stat['totalTestResultsIncrease'].rolling(roll).mean(), c='b')
    plt.plot(stat['date'], stat['totalTestResultsIncrease'], c='b', alpha=.25)
    plt.gcf().autofmt_xdate()
    plt.title("{state} Tests per Day ({roll}-day rolling mean)".format(state=state, roll=roll))
    plt.xlabel("Date")
    plt.ylabel("Tests per Day")
    figure_name = get_directory(_base_directory, state, '{state}_tests_per_day.png'.format(state=state))
    plt.savefig(fname=figure_name, format='png')
    plt.clf()

    # new deaths
    plt.plot(stat['date'], stat['deathIncrease'].rolling(roll).mean(), c='y')
    plt.plot(stat['date'], stat['deathIncrease'], c='y', alpha=.25)
    plt.title("{state} Deaths per (Day {roll}-day rolling mean)".format(state=state, roll=roll))
    plt.xlabel("Date")
    plt.ylabel("AVG Deaths per Day")
    plt.gcf().autofmt_xdate()
    figure_name = get_directory(_base_directory, state, '{state}_deaths_per_day.png'.format(state=state))
    plt.savefig(fname=figure_name, format='png')
    plt.clf()

    # new tests by new cases
    plt.plot(stat['date'], stat['positiveIncrease'].rolling(7).mean(), c='r')
    plt.plot(stat['date'], stat['totalTestResultsIncrease'].rolling(7).mean() / 5, c='b')
    plt.legend(['new cases', 'new tests / 5'])
    plt.gcf().autofmt_xdate()
    plt.title("{state} New Cases and Tests ({roll}-day rolling mean)".format(state=state, roll=roll))
    plt.xlabel("Date")
    plt.ylabel("New Cases or Tests")
    figure_name = get_directory(_base_directory, state, '{state}_new_tests_and_cases.png'.format(state=state))
    plt.savefig(fname=figure_name, format='png')
    plt.clf()

    # new cases to new deaths
    plt.plot(stat['date'], stat['deathIncrease'].rolling(7).mean(), c='y')
    plt.plot(stat['date'], stat['positiveIncrease'].rolling(7).mean() / 10, c='r')
    plt.legend(['new deaths', 'new cases / 10'])
    plt.gcf().autofmt_xdate()
    plt.title("{state} New Cases and Deaths ({roll}-day rolling mean)".format(state=state, roll=roll))
    plt.xlabel("Date")
    plt.ylabel("New Cases or Deaths")
    figure_name = get_directory(_base_directory, state, '{state}_new_cases_and_deaths.png'.format(state=state))
    plt.savefig(fname=figure_name, format='png')
    plt.clf()

    # scatter plot new cases to new tests
    corr = stat[
        ['positiveIncrease', 'totalTestResultsIncrease']
    ].corr(method='spearman')['positiveIncrease'].tolist()[-1]
    plt.scatter(stat['totalTestResultsIncrease'], stat['positiveIncrease'])
    plt.title("New Confirmed Cases Compared to Tests Performed")
    plt.xlabel('{} New Tests Per Day'.format(state))
    plt.ylabel("New Confirmed Caeses Per Day")
    plt.legend(['rho = {}'.format(str(corr)[:6])])
    figure_name = get_directory(_base_directory, state, '{state}_cases_and_tests_scatter.png'.format(state=state))
    plt.savefig(fname=figure_name, format='png')
    plt.clf()

    # active case breakdown
    plt.plot(stat['date'], stat['inIcuCurrently'].rolling(roll).mean())
    plt.plot(stat['date'], stat['onVentilatorCurrently'].rolling(roll).mean())
    plt.plot(stat['date'], stat['hospitalizedCurrently'].rolling(roll).mean())
    plt.plot(stat['date'], stat['positiveIncrease'].rolling(roll).mean())
    plt.plot(stat['date'], stat['deathIncrease'].rolling(roll).mean())
    plt.gcf().autofmt_xdate()
    plt.legend(['In ICU', 'On Ventilator', 'In Hospital', 'New Cases', 'New Deaths'])
    plt.title("{} Active Case Breakdown".format(state))
    plt.ylabel('Patients in Category')
    plt.xlabel('Date')
    figure_name = get_directory(_base_directory, state, '{state}_active_cases.png'.format(state=state))
    plt.savefig(fname=figure_name, format='png')
    plt.clf()


def run_job():
    state_list = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY',
        'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
        'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'USA'
    ]
    for state in state_list:
        plot_state_data(state)


if __name__ == '__main__':
    run_job()
    # plot_state_data('nv')
