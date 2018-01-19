import {getMousePos} from '../tools/utils';
export default {
  methods: {
    cellMouseEnter (row, column, cell, event) {
      let e = event ? event : window.event;
      let target = e.target || e.srcElement;
      if (this.isValid(row) === 1) {
        let body = document.body;
        let el = null;
        let pos = getMousePos(e);
        el = document.getElementById('valid-tooltip');
        if (!el) {
          el = document.createElement('div');
          el.id = 'valid-tooltip';
          el.innerText = '近效期';
        }
        el.style.top = (pos.y - 20) + 'px';
        el.style.left = (pos.x + 10) + 'px';
        body.appendChild(el);
      }
    },
    cellMouseLeave () {
      let body = document.body;
      let el = document.getElementById('valid-tooltip');
      if (body && el) {
        body.removeChild(el);
      }
    }
  }
};
