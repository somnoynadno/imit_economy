'use strict';

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(main);


function gaussianRand() {
  var rand = 0;

  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  // что-то близкое к нормальному
  return rand / 6;
}


function drawChart(dots) {
    var data = google.visualization.arrayToDataTable(dots);

    var options = {
        title: 'Exchange rate',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph-container'));

    chart.draw(data, options);
}

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.sell = this.props.sell.bind(this);
        this.buy = this.props.buy.bind(this);
    }

    render() {
        return (
            <div className="row mt-2">
                <div className="col">
                    <form>
                        <div className="form-group">
                            <label htmlFor="sell-amount">How much you wanna sell?</label>
                            <input type="text" className="form-control" id="sell-amount" />
                        </div>
                        <div className="btn btn-primary" onClick={this.sell}>
                            Sell
                        </div>
                    </form>
                </div>
                <div className="col">
                    <form>
                        <div className="form-group">
                            <label htmlFor="buy-amount">How much you wanna buy?</label>
                            <input type="text" className="form-control" id="buy-amount" />
                        </div>
                        <div className="btn btn-primary" onClick={this.buy}>
                            Buy
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

class Params extends React.Component {
    constructor(props) {
        super(props);

        this.updateParams = this.props.updateParams.bind(this);
    }

    render() {
        return (
          <div>
            <div className="row mt-2 justify-content-end">
                <div className="col col-auto">
                    <label htmlFor="volatility">Volatility</label>
                    <input type="text" className="form-control" id="volatility" />
                </div>
                <div className="col col-auto">
                    <label htmlFor="price-trend">Price trend</label>
                    <input type="text" className="form-control" id="price-trend" />
                </div>
                <div className="col col-auto p-4">
                    <div className="btn btn-primary" onClick={this.updateParams}>
                        Confirm
                    </div>
                </div>
            </div>
            <hr className="clearfix" />
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
                    <p>Money: {this.props.money} </p>
                    <p>Securities: {this.props.securities} </p>
                </div>
                <div className="col">
                    <h2>Current:</h2>
                    <p>Day: {this.props.day} </p>
                    <p>Price: {this.props.price} </p>
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.k = 0.5;
        this.dots = [['Day', 'Price']];

        this.state = {
            currentDay: -1,
            moneyAmount: 300,
            securitiesAmount: 3,
            securityCurrentPrice: 50,
            priceTrend: 0.1,
            volatility: 5
        };

        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentDidMount() {
      $('#price-trend').val(this.state.priceTrend);
      $('#volatility').val(this.state.volatility);
    }

    tick() {
        // let newPrice = this.state.securityCurrentPrice * (1 + this.k * (Math.random() - 0.5));

        // т.к. шаг времени равен единице, формула сильно упростилась
        let newPrice = this.state.securityCurrentPrice + this.state.priceTrend + this.state.volatility*(gaussianRand()-0.5);

        this.setState({
            currentDay: this.state.currentDay + 1,
            securityCurrentPrice: newPrice
        });

        this.dots.push([this.state.currentDay + 1, newPrice]);

        drawChart(this.dots);
        console.log(this.state);
    }

    updateParams() {
      let volatility = Number($('#volatility').val());
      let priceTrend = Number($('#price-trend').val());

      if (!isNaN(volatility) && !isNaN(priceTrend)) {
        this.setState({
          volatility: volatility,
          priceTrend: priceTrend
        });
      }
    }

    sell() {
        let amount = Number($('#sell-amount').val());

        if (!isNaN(amount) && amount > 0 && this.state.securitiesAmount - amount >= 0) {
            this.setState({
                moneyAmount: this.state.moneyAmount + this.state.securityCurrentPrice*amount,
                securitiesAmount: this.state.securitiesAmount - amount
            });
        }
    }

    buy() {
        let amount = Number($('#buy-amount').val());

        if (!isNaN(amount) && amount > 0 && this.state.moneyAmount >= this.state.securityCurrentPrice*amount) {
            this.setState({
                moneyAmount: this.state.moneyAmount - this.state.securityCurrentPrice*amount,
                securitiesAmount: this.state.securitiesAmount + amount
            });
        }
    }

    render() {
        return (
            <div>
                <Params updateParams={this.updateParams.bind(this)} />
                <Menu
                    // callbacks
                    sell={this.sell.bind(this)}
                    buy={this.buy.bind(this)}
                />
                <Statistics
                    day={this.state.currentDay}
                    money={this.state.moneyAmount}
                    securities={this.state.securitiesAmount}
                    price={this.state.securityCurrentPrice}
                />
                <Graphics
                    dots={this.state.dots}
                />
            </div>
        )
    }
}

function main() {
    ReactDOM.render(
        <Game />,
        document.getElementById('container')
    );
}
