import Transactions from './components/Transactions';
import MaharlikaTile from './components/MaharlikaTile';
import EtherTile from './components/EtherTile';
import UserSidebar from './components/UserSidebar';
import numFormat from 'vue-filter-number-format';

window.numeral = require('numeral');

Vue.filter('numberFormat', numFormat(numeral));
Vue.filter('trimAddress', function (value) {
    let text = value.replace(/(<([^>]+)>)/ig, '');
    return text.substring(0, 7) + '...' + text.substr(value.length - 4 );
});
Vue.filter('reduceSizeDecimal', (number) => {
    let stringNumber = number.toString(),
        wholeNumber = stringNumber.slice(0, stringNumber.length-3),
        decimals = stringNumber.slice(stringNumber.length-3, stringNumber.length);

    return wholeNumber + `<span style'font-size:10px'>${decimals}</span>`;
});
Vue.filter('upperAddress', (text) => {
    return text.slice(0,2) + text.slice(3, 22).toUpperCase() + text.slice(23, text.length).toUpperCase();
});
Vue.use(require('vue-moment'));

new Vue({
    el: '#app',
    components: {
        Transactions,
        MaharlikaTile,
        EtherTile,
        UserSidebar
    }
});
