'use strict';

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(main);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Day', 'Price'],
        ['2004',  1000],
        ['2005',  1170],
        ['2006',  660],
        ['2007',  1030],
    ]);

    var options = {
        title: 'Exchange rate',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph-container'));

    chart.draw(data, options);
}

class Menu extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col">
                    <form>
                        <div className="form-group">
                            <label htmlFor="sell-amount">How much you wanna sell?</label>
                            <input type="text" className="form-control" id="sell-amount" />
                        </div>
                        <div className="btn btn-primary">
                            Sell
                        </div>
                    </form>
                </div>
                <div className="col">
                    <form>
                        <div className="form-group">
                            <label htmlFor="buy-amount">How much you wanna buy?</label>
                            <input type="text" className="form-control" id="buy-amount"/>
                        </div>
                        <div className="btn btn-primary">
                            Buy
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

class Graphics extends React.Component {
    constructor(props) {
        super(props);
        this.divStyle = {
            overflowX: "scroll",
            overflowY: "hidden",    
            width: "100%",
            height: "500px"
        };
    }

    render() {
        return (
            <div id="graph-container" className="row" style={this.divStyle}>

            </div>
        )
    }
}

class Statistics extends React.Component {
    render() {
        return (
            <div className="row mt-4">
                <div className="col">
                    <h2>You have:</h2>
                    <p>Money: 100</p>
                    <p>Securities: 0</p>
                </div>
                <div className="col">
                    <h2>Current:</h2>
                    <p>Day: 1</p>
                    <p>Price: 100</p>
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    render() {
        return (
            <div>
                <h1>Economy</h1>
                <Menu />
                <Statistics />
                <Graphics />
            </div>
        )
    }
}

function main() {
    ReactDOM.render(
        <Game />,
        document.getElementById('container')
    );
    drawChart();
}