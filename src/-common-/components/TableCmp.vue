<template>
  <section class="table">
    <!-- ------------------------- Table Header ---------------------------- -->
    <header class="table-header">
      <div v-for="col in columns"
        :key="`header-column_${col.column}`"
        :style="[col.size ? { width: col.size + '%' } : { flex: 1 } ]"
        class="table-header-item"
        :class="{ active: sortData ? sortData.key === col.column : false }">
        <span :class="{ sortable: col.sortable }"
          @click="col.sortable ? sort(col.column) : false">{{ col.title }}</span>
        <span class="caret-icon"
          :class="caretName">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 307.054 307.054" style="enable-background:new 0 0 307.054 307.054;" xml:space="preserve">
            <g>
              <g id="_x34_85._Up">
                <g>
                  <path d="M302.445,205.788L164.63,67.959c-6.136-6.13-16.074-6.13-22.203,0L4.597,205.788c-6.129,6.132-6.129,16.069,0,22.201
                    l11.101,11.101c6.129,6.136,16.076,6.136,22.209,0l115.62-115.626L269.151,239.09c6.128,6.136,16.07,6.136,22.201,0
                    l11.101-11.101C308.589,221.85,308.589,211.92,302.445,205.788z"/>
                </g>
              </g>
            </g>
          </svg>
        </span>
      </div>
      <div v-if="actions"
        class="table-header-item actions">
        <span>Actions</span>
      </div>
    </header>

    <!-- -------------------------- Table Rows ----------------------------- -->
    <ul v-if="value.length > 0"
      :style="{ maxHeight: maxHeight }"
      class="table-list">
      <li v-for="rowItem in value"
        :key="`list-item_${rowItem.id}`"
        class="table-list-item">

        <!-- Data Columns -->
        <div v-for="col in columns"
          :key="`list-item_${rowItem.id}-column_${col.column}`"
          :style="[ col.size ? { width: col.size + '%' } : { flex: 1 } ]"
          class="table-list-item-column">
          <span :id="`list-item_${rowItem.id}-${col.column}`">
              {{ rowItem[col.column] }}
          </span>
        </div>

        <!-- Actions column -->
        <div v-if="actions"
          class="table-list-item-column actions">
          <div v-for="(action, index) in actions"
            :key="`action_${action.action}`"
            class="action"
            @click="actions[index].access(rowItem) ? $emit(`action-${action.action}`, rowItem) : false">
            <!-- if 'icon' prop is passed, render that component -->
            <component v-if="actions[index].icon"
              :is="actions[index].icon"
              class="action-icon"
              :disabled="!actions[index].access(rowItem)">
            </component>
            <!-- else render text contained inside 'action' prop -->
            <span v-else :class="{ disabled: !actions[index].access(rowItem) }">{{ actions[index].action }}</span>
          </div>
        </div>

        <!-- Selection check box -->
        <div v-if="selection"
          class="checkbox">
          <label>
            <i class="helper"
              :class="{ 'helper-checked': selection.findIndex((item) => item.id === rowItem.id) !== -1 }"
              @click="toggle(rowItem)"></i>
          </label>
        </div>
      </li>
    </ul>

    <!-- node display in case of empty value array -->
    <ul v-else
      class="table-list">
      <li class="table-list-item no-value">
        <span>{{ noValueMsg }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'TableCmp',
  props: {
    value: { type: Array, required: true },
    columns: {
      type: Array,
      required: true,
      // custom prop validator
      validator: val => {
        const isValid = (() => {
          // return check if every element inside prop is an Object
          // and contains 'column' prop which is mandatory
          return val.every(el => {
            return el === Object(el) && el.column && typeof el.column === 'string'
          })
        })()
        // if validation is true
        // set some default properties to elements that are inside passed prop
        if (isValid) {
          for (let el of val) {
            if (!el.title) el.title = el.column
            if (typeof el.sortable !== 'boolean') el.sortable = false
          }
        }
        // return result of prop validation
        return isValid
      }
    },
    actions: {
      type: Array,
      // custom prop validator
      validator: val => {
        const isValid = (() => {
          // return check if every element inside prop is an Object
          // and contains 'action' prop which is mandatory
          return val.every(el => {
            return el === Object(el) && el.action && typeof el.action === 'string'
          })
        })()
        // if validation is true
        // set some default properties to elements that are inside passed prop
        if (isValid) {
          for (let el of val) {
            if (typeof el.access !== 'function') el.access = () => true
          }
        }
        // return result of prop validation
        return isValid
      }
    },
    selection: { type: Array },
    sortData: { type: Object },
    maxHeight: { type: String, default: '100%' },
    noValueMsg: { type: String, default: 'No data available' }
  },
  computed: {
    caretName () {
      if (this.sortData) {
        return this.sortData.order === 'asc' ? 'up' : 'down'
      } else return ''
    }
  },
  methods: {
    sort (column) {
      this.$emit('sort', column)
    },
    toggle (rowItem) {
      let selected = this.selection.slice()
      const index = selected.findIndex((item) => item.id === rowItem.id)
      if (index !== -1) selected = selected.filter(item => item.id !== rowItem.id)
      else selected.push(rowItem)
      this.$emit('select', selected)
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  background-color: transparent;
  width: 100%;
  height: 100%;

  &-header {
    background-color: white;
    position: relative;
    z-index: 2;
    display: flex;
    flex-flow: row wrap;
    height: 3.125rem;
    padding: 0 3.25vw 0 4vw;
    margin: 0;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);

    @media screen and (max-width: 767px) {
      height: 2.625rem;
      padding: 0 1.5vw 0 5.25vw;
    }

    &-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      list-style-type: none;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: bold;
      color: black;

      @media screen and (max-width: 767px) {
        font-size: 8px;
      }

      span {
        cursor: default;

        &.sortable {
          cursor: pointer;
        }
      }

      .caret-icon {
        width: 11px;
        height: 11px;
        margin-left: 10px;
        opacity: 0;
        fill: black;

        @media screen and (max-width: 767px) {
          width: 7px;
          height: 7px;
          margin-left: 5px;
        }

        &.down {
          transform: rotateX(180deg);
        }
      }

      &.actions {
        flex: 1;
        justify-content: center;
      }

      &.active {
        .caret-icon {
          opacity: 1;
        }
      }
    }
  }

  &-list {
    background-color: white;
    list-style: none;
    overflow: auto;
    position: relative;
    height: auto;
    padding: 0;
    margin: 10px 0;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);

    &-item {
      display: flex;
      flex-flow: row wrap;
      align-items: flex-start;
      margin: 0;
      padding: 1.2rem 3.25vw 1.2rem 4vw;
      color: grey;
      border-bottom: 1px solid lightgray;

      @media screen and (max-width: 767px) {
        padding: .8rem 1.5vw .8rem 5.25vw;
      }

      &.no-value {
        justify-content: center;
      }

      span {
        font-size: 14px;
        margin: 0 1.25rem 0 0;

        @media screen and (max-width: 767px) {
          font-size: 10px;
        }
      }

      &-column {
        display: flex;
        align-items: center;
        list-style-type: none;
        font-size: 12px;
        color: black;

        @media screen and (max-width: 767px) {
          font-size: 8px;
        }

        &.actions {
          flex: 1;
          justify-content: center;

          .action {
            margin: 0 0.4rem;

            @media screen and (max-width: 767px) {
              margin: 0 0.2rem;
            }

            &-icon {
              width: 20px;
              height: 20px;

              @media screen and (max-width: 767px) {
                width: 14px;
                height: 14px;
              }
            }

            span {
              color: #6d6d6d;
              text-align: left;
              width: 20px;
              height: 20px;
              cursor: pointer;

              @media screen and (max-width: 767px) {
                width: 14px;
                height: 14px;
              }

              &.disabled {
                opacity: 0.4;
                cursor: default;
              }
            }
          }
        }
      }
    }
  }

  .checkbox {
    position: absolute;
    left: 1vw;
    display: block;

    @media screen and (max-width: 767px) {
      left: 0;
    }
  }

  .helper {
    position: absolute;
    top: -5px;
    left: 0;
    cursor: pointer;
    display: block;
    font-size: 1rem;
    user-select: none;
    color: gray;
  }

  .helper:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    margin: 0.25rem;
    width: 1rem;
    height: 1rem;
    transition: transform 0.28s ease;
    border-radius: 0.125rem;
    background-color: white;
    border: solid 1px lightgray;
    border-radius: 3px;

    @media screen and (max-width: 767px) {
      width: .7rem;
      height: .7rem;
    }
  }

  .helper:after {
    content: '';
    display: block;
    width: 8px;
    height: 5px;
    border-bottom: 2px solid white;
    border-left: 2px solid white;
    -webkit-transform: rotate(-45deg) scale(0);
    -moz-transform: rotate(-45deg) scale(0);
    -ms-transform: rotate(-45deg) scale(0);
    transform: rotate(-45deg) scale(0);
    position: absolute;
    top: 8px;
    left: 8px;

    @media screen and (max-width: 767px) {
      width: 5px;
      height: 3px;
      top: 7px;
      left: 7px;
    }
  }

  .helper-checked:before {
    background-color: cornflowerblue;
  }

  .helper-checked:after {
    -webkit-transform: rotate(-45deg) scale(1);
    -moz-transform: rotate(-45deg) scale(1);
    -ms-transform: rotate(-45deg) scale(1);
    transform: rotate(-45deg) scale(1);
  }

  .checkbox label {
    margin-bottom: 0;
    font-weight: normal;
    cursor: pointer;
    vertical-align: sub;
  }
}
</style>
