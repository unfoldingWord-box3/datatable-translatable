import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import MUIDataTable from 'mui-datatables';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class Cities extends React.Component {
  render() {
    const {
      value, index, change,
    } = this.props;
    const cities = ['Aberdeen', 'Abilene', 'Akron', 'Albany', 'Albuquerque', 'Alexandria', 'Allentown', 'Amarillo', 'Anaheim', 'Anchorage', 'Ann Arbor', 'Antioch', 'Apple Valley', 'Appleton', 'Arlington', 'Arvada', 'Asheville', 'Athens', 'Atlanta', 'Atlantic City', 'Augusta', 'Aurora', 'Austin', 'Bakersfield', 'Baltimore', 'Barnstable', 'Baton Rouge', 'Beaumont', 'Bel Air', 'Bellevue', 'Berkeley', 'Bethlehem', 'Billings', 'Birmingham', 'Bloomington', 'Boise', 'Boise City', 'Bonita Springs', 'Boston', 'Boulder', 'Bradenton', 'Bremerton', 'Bridgeport', 'Brighton', 'Brownsville', 'Bryan', 'Buffalo', 'Burbank', 'Burlington', 'Cambridge', 'Canton', 'Cape Coral', 'Carrollton', 'Cary', 'Cathedral City', 'Cedar Rapids', 'Champaign', 'Chandler', 'Charleston', 'Charlotte', 'Chattanooga', 'Chesapeake', 'Chicago', 'Chula Vista', 'Cincinnati', 'Clarke County', 'Clarksville', 'Clearwater', 'Cleveland', 'College Station', 'Colorado Springs', 'Columbia', 'Columbus', 'Concord', 'Coral Springs', 'Corona', 'Corpus Christi', 'Costa Mesa', 'Dallas', 'Daly City', 'Danbury', 'Davenport', 'Davidson County', 'Dayton', 'Daytona Beach', 'Deltona', 'Denton', 'Denver', 'Des Moines', 'Detroit', 'Downey', 'Duluth', 'Durham', 'El Monte', 'El Paso', 'Elizabeth', 'Elk Grove', 'Elkhart', 'Erie', 'Escondido', 'Eugene', 'Evansville', 'Fairfield', 'Fargo', 'Fayetteville', 'Fitchburg', 'Flint', 'Fontana', 'Fort Collins', 'Fort Lauderdale', 'Fort Smith', 'Fort Walton Beach', 'Fort Wayne', 'Fort Worth', 'Frederick', 'Fremont', 'Fresno', 'Fullerton', 'Gainesville', 'Garden Grove', 'Garland', 'Gastonia', 'Gilbert', 'Glendale', 'Grand Prairie', 'Grand Rapids', 'Grayslake', 'Green Bay', 'GreenBay', 'Greensboro', 'Greenville', 'Gulfport-Biloxi', 'Hagerstown', 'Hampton', 'Harlingen', 'Harrisburg', 'Hartford', 'Havre de Grace', 'Hayward', 'Hemet', 'Henderson', 'Hesperia', 'Hialeah', 'Hickory', 'High Point', 'Hollywood', 'Honolulu', 'Houma', 'Houston', 'Howell', 'Huntington', 'Huntington Beach', 'Huntsville', 'Independence', 'Indianapolis', 'Inglewood', 'Irvine', 'Irving', 'Jackson', 'Jacksonville', 'Jefferson', 'Jersey City', 'Johnson City', 'Joliet', 'Kailua', 'Kalamazoo', 'Kaneohe', 'Kansas City', 'Kennewick', 'Kenosha', 'Killeen', 'Kissimmee', 'Knoxville', 'Lacey', 'Lafayette', 'Lake Charles', 'Lakeland', 'Lakewood', 'Lancaster', 'Lansing', 'Laredo', 'Las Cruces', 'Las Vegas', 'Layton', 'Leominster', 'Lewisville', 'Lexington', 'Lincoln', 'Little Rock', 'Long Beach', 'Lorain', 'Los Angeles', 'Louisville', 'Lowell', 'Lubbock', 'Macon', 'Madison', 'Manchester', 'Marina', 'Marysville', 'McAllen', 'McHenry', 'Medford', 'Melbourne', 'Memphis', 'Merced', 'Mesa', 'Mesquite', 'Miami', 'Milwaukee', 'Minneapolis', 'Miramar', 'Mission Viejo', 'Mobile', 'Modesto', 'Monroe', 'Monterey', 'Montgomery', 'Moreno Valley', 'Murfreesboro', 'Murrieta', 'Muskegon', 'Myrtle Beach', 'Naperville', 'Naples', 'Nashua', 'Nashville', 'New Bedford', 'New Haven', 'New London', 'New Orleans', 'New York', 'New York City', 'Newark', 'Newburgh', 'Newport News', 'Norfolk', 'Normal', 'Norman', 'North Charleston', 'North Las Vegas', 'North Port', 'Norwalk', 'Norwich', 'Oakland', 'Ocala', 'Oceanside', 'Odessa', 'Ogden', 'Oklahoma City', 'Olathe', 'Olympia', 'Omaha', 'Ontario', 'Orange', 'Orem', 'Orlando', 'Overland Park', 'Oxnard', 'Palm Bay', 'Palm Springs', 'Palmdale', 'Panama City', 'Pasadena', 'Paterson', 'Pembroke Pines', 'Pensacola', 'Peoria', 'Philadelphia', 'Phoenix', 'Pittsburgh', 'Plano', 'Pomona', 'Pompano Beach', 'Port Arthur', 'Port Orange', 'Port Saint Lucie', 'Port St. Lucie', 'Portland', 'Portsmouth', 'Poughkeepsie', 'Providence', 'Provo', 'Pueblo', 'Punta Gorda', 'Racine', 'Raleigh', 'Rancho Cucamonga', 'Reading', 'Redding', 'Reno', 'Richland', 'Richmond', 'Richmond County', 'Riverside', 'Roanoke', 'Rochester', 'Rockford', 'Roseville', 'Round Lake Beach', 'Sacramento', 'Saginaw', 'Saint Louis', 'Saint Paul', 'Saint Petersburg', 'Salem', 'Salinas', 'Salt Lake City', 'San Antonio', 'San Bernardino', 'San Buenaventura', 'San Diego', 'San Francisco', 'San Jose', 'Santa Ana', 'Santa Barbara', 'Santa Clara', 'Santa Clarita', 'Santa Cruz', 'Santa Maria', 'Santa Rosa', 'Sarasota', 'Savannah', 'Scottsdale', 'Scranton', 'Seaside', 'Seattle', 'Sebastian', 'Shreveport', 'Simi Valley', 'Sioux City', 'Sioux Falls', 'South Bend', 'South Lyon', 'Spartanburg', 'Spokane', 'Springdale', 'Springfield', 'St. Louis', 'St. Paul', 'St. Petersburg', 'Stamford', 'Sterling Heights', 'Stockton', 'Sunnyvale', 'Syracuse', 'Tacoma', 'Tallahassee', 'Tampa', 'Temecula', 'Tempe', 'Thornton', 'Thousand Oaks', 'Toledo', 'Topeka', 'Torrance', 'Trenton', 'Tucson', 'Tulsa', 'Tuscaloosa', 'Tyler', 'Utica', 'Vallejo', 'Vancouver', 'Vero Beach', 'Victorville', 'Virginia Beach', 'Visalia', 'Waco', 'Warren', 'Washington', 'Waterbury', 'Waterloo', 'West Covina', 'West Valley City', 'Westminster', 'Wichita', 'Wilmington', 'Winston', 'Winter Haven', 'Worcester', 'Yakima', 'Yonkers', 'York', 'Youngstown'];

    return (
      <FormControl>
        <Select value={value} onChange={event => change(event.target.value, index)} style={{ fontSize: 'inherit' }}>
          { cities.map((city, index) =>
            <MenuItem key={index} value={city}>{city}</MenuItem>,
          )}
        </Select>
      </FormControl>
    );
  }
}

class TestDatatable extends React.Component {
  render() {
    const columns = [
      {
        name: 'Name',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <FormControlLabel
              value={value}
              control={<TextField value={value} />}
              onChange={event => updateValue(event.target.value)}
            />
          ),
        },
      },
      {
        name: 'Title',
        options: { filter: true },
      },
      {
        name: 'Location',
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <Cities
              value={value}
              index={tableMeta.columnIndex}
              change={event => updateValue(event)}
            />
          ),
        },
      },
      {
        name: 'Age',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <FormControlLabel
              control={<TextField value={value || ''} type='number' />}
              onChange={event => updateValue(event.target.value)}
            />
          ),
        },
      },
      {
        name: 'Salary',
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            const nf = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });

            return nf.format(value);
          },
        },
      },
      {
        name: 'Active',
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <FormControlLabel
              label={value ? 'Yes' : 'No'}
              value={value ? 'Yes' : 'No'}
              control={
                <Switch color="primary" checked={value} value={value ? 'Yes' : 'No'} />
              }
              onChange={event => {
                updateValue(event.target.value === 'Yes' ? false : true);
              }}
            />
          ),
        },
      },
    ];

    const data = [
      ['Robin Duncan', 'Business Analyst', 'Los Angeles', null, 77000, false],
      ['Mel Brooks', 'Business Consultant', 'Oklahoma City', 37, null, true],
      ['Harper White', 'Attorney', 'Pittsburgh', 52, 420000, false],
      ['Kris Humphrey', 'Agency Legal Counsel', 'Laredo', 30, 150000, true],
      ['Frankie Long', 'Industrial Analyst', 'Austin', 31, 170000, false],
      ['Brynn Robbins', 'Business Analyst', 'Norfolk', 22, 90000, true],
      ['Justice Mann', 'Business Consultant', 'Chicago', 24, 133000, false],
      ['Addison Navarro', 'Business Management Analyst', 'New York', 50, 295000, true],
      ['Jesse Welch', 'Agency Legal Counsel', 'Seattle', 28, 200000, false],
      ['Eli Mejia', 'Commercial Specialist', 'Long Beach', 65, 400000, true],
      ['Gene Leblanc', 'Industrial Analyst', 'Hartford', 34, 110000, false],
      ['Danny Leon', 'Computer Scientist', 'Newark', 60, 220000, true],
      ['Lane Lee', 'Corporate Counselor', 'Cincinnati', 52, 180000, false],
      ['Jesse Hall', 'Business Analyst', 'Baltimore', 44, 99000, true],
      ['Danni Hudson', 'Agency Legal Counsel', 'Tampa', 37, 90000, false],
      ['Terry Macdonald', 'Commercial Specialist', 'Miami', 39, 140000, true],
      ['Justice Mccarthy', 'Attorney', 'Tucson', 26, 330000, false],
      ['Silver Carey', 'Computer Scientist', 'Memphis', 47, 250000, true],
      ['Franky Miles', 'Industrial Analyst', 'Buffalo', 49, 190000, false],
      ['Glen Nixon', 'Corporate Counselor', 'Arlington', 44, 80000, true],
      ['Gabby Strickland', 'Business Process Consultant', 'Scottsdale', 26, 45000, false],
      ['Mason Ray', 'Computer Scientist', 'San Francisco', 39, 142000, true],
    ];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'standard',
    };

    return (
      <MUIDataTable title={'ACME Employee list'} data={data} columns={columns} options={options} />
    );
  }
}

export default TestDatatable;
