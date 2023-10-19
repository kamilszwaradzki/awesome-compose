import React from "react";

export default class JobAppList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeColumn: 'from',
      ids: true
    };
  }

  handleSearch(data, keyword) {
    this.setState({
      ids: data.map((jobapp, i) => ({
        id: i,
        from: jobapp.text,
        sendDate: jobapp.whenApplied,
        source: jobapp.from,
        desc: jobapp.description,
        stateApp: jobapp.state,
      })).filter((item) => item[this.state.activeColumn].toLowerCase().includes(keyword.toLowerCase())).map(d => d['id']),
    });
  }

  handleColumn(col) {
    this.setState({
      activeColumn: col,
    });
  }

  sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("job-apps-table");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  sortTableNum(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("job-apps-table");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc"; 
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        //check if the two rows should switch place:
        if (dir == "asc") {
          if (Number(x.innerHTML) > Number(y.innerHTML)) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (Number(x.innerHTML) < Number(y.innerHTML)) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        //Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /*If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again.*/
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  renderJobApps(jobapps) {
    return (
      <>
      <fieldset>
      <legend>Wyszukiwarka po rekordach</legend>
      <div className="row g-2">
        <div className="col-md">
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="search-category">Kolumna</label>
            <select id="search-category" className="form-select" onChange = {(event) => {this.handleColumn(event.target.value)}} defaultValue="from">
              <option value="from">Do kogo</option>
              <option value="sendDate">Data wysłania</option>
              <option value="source">Źródło</option>
              <option value="desc">Opis</option>
            </select>
          </div>
        </div>
        <div className="col-md">
          <div>
            <input id="searchId" name="search" className="form-control" placeholder="Szukaj..." type='text' onChange = {(event) => {this.handleSearch(jobapps, event.target.value)}}/>
          </div>
        </div>
      </div>
      </fieldset>
      <div>
      <table id="job-apps-table">
        <thead>
          <tr>
            <th onClick = {() => {this.sortTableNum(0)}}>ID</th>
            <th onClick = {() => {this.sortTable(1)}}>Do kogo</th>
            <th onClick = {() => {this.sortTable(2)}}>Data wysłania</th>
            <th onClick = {() => {this.sortTable(3)}}>Źródło</th>
            <th onClick = {() => {this.sortTable(4)}}>Uwagi</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        {jobapps.map((jobapp, i) => (
          <tr 
              className={
                (this.state.ids === true ? "" : (this.state.ids.includes(i) ? "" : "notActive"))
              }
              key={i}
          >
            <td>{i}</td>
            <td>{jobapp.text}</td>
            <td>{jobapp.whenApplied}</td>
            <td>{jobapp.from}</td>
            <td>{jobapp.description}</td>
            <td>
              <select id={"state_" + jobapp._id} defaultValue={jobapp.state} onChange = {(event) => {this.props.handleUpdateJobApp(jobapp._id, event.target.value)}}>
                <option value="sent">Wysłane</option>
                <option value="open">Otwarte</option>
                <option value="reviewed">Rozpatrzone</option>
                <option value="invited">Rozmowa</option>
                <option value="denied">Podziękowanie</option>
              </select>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>
      </>
    );
  }

  render() {
    let { jobapps } = this.props;
    return jobapps.length > 0 ? (
      this.renderJobApps(jobapps)
    ) : (
      <div className="alert alert-primary" role="alert">
        No Job Applications to display
      </div>
    );
  }
}
