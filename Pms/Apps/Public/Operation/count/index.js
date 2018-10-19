/**
 * Created by Struggle on 2016/9/18.
 */
define(function (require) {
    var $ = require('jquery');
    require('echarts-all');
    require('vue');
    require('digitroll');
    /**
     * countup 当前售票总数
     * onLinePerson 四子王旗在线游客统计图
     * userFromMap  用户来源分布图
     * userRegisterTable 用户每月注册数
     * orderAmount 每月订单销售额
     * */
    var onLinePerson = echarts.init(document.getElementById('onLinePerson'));
    var userFromMap = echarts.init(document.getElementById('userFromMap'));
    var userRegisterTable = echarts.init(document.getElementById('userRegister'));
    var orderAmountTable = echarts.init(document.getElementById('orderAmount'));
    var ticketAmountTable = echarts.init(document.getElementById('ticketAmount'));
    var ticketMoneyTable = echarts.init(document.getElementById('ticketMoney'));
    var ageTable = echarts.init(document.getElementById('age'));
    var futureTable = echarts.init(document.getElementById('future'));
    echarts.util.mapData.params.params.huangpingxian = {
        getGeoJson: function (callback) {
            jQuery.getJSON('../../../Public/js/huangpingxian.json', function (data) {
                callback(data)
            });
        }
    };
    echarts.util.mapData.params.params.四子王旗 = {
        getGeoJson: function (callback) {
            jQuery.getJSON('../../../Public/js/siziwangqi.json', function (data) {
                callback(data)
            });
        }
    };
    new Vue({
        el: "#app",
        ready: function () {
            var vm = this;
            vm.init();
            var ticketNum = new DigitRoll({
                container: '#countup',
                width: 9
            });

            ticketNum.roll(vm.totalTicket);
            //ticketNum.roll(fRandomBy(0,9999999))
            setInterval(function () {
                // ticketNum.roll(vm.getTotalTicket())
                vm.totalTicket+=fRandomBy(0,30);
                ticketNum.roll(vm.totalTicket);
            }, 5000);
            setInterval(function () {
                vm.init();
            }, 1800000);
            vm.loading = false;
        },
        methods: {
            init: function () {
                var vm = this;
                vm.getData();
                onLinePerson.setOption(vm.getOnlinePerson());
                userFromMap.setOption(vm.getUserFrom());
                userRegisterTable.setOption(vm.getUserRegister());
                orderAmountTable.setOption(vm.getOrderAmount());
                ageTable.setOption(vm.getAge());
                futureTable.setOption(vm.getFuture());
                ticketAmountTable.setOption(vm.getmonthTicket('amount'));
                ticketMoneyTable.setOption(vm.getmonthTicket('money'));
            },
            getData: function () {
                var vm = this;
                jQuery.ajax({
                    url: '../../../Public/js/huangpingxian.json',
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    beforeSend: function () {
                        onLinePerson.showLoading();
                        userFromMap.showLoading();
                        userRegisterTable.showLoading();
                        orderAmountTable.showLoading();
                    },
                    complete: function () {
                        onLinePerson.hideLoading();
                        userFromMap.hideLoading();
                        userRegisterTable.hideLoading();
                        orderAmountTable.hideLoading();
                    },
                    success: function (data) {
                        if (data.code == 200) {
                            if (!vm.totalTicket) {
                                vm.$set('totalTicket', data.data.ticket.total.amount);
                            }
                            vm.$set('userFrom', data.data.user);
                            vm.$set('userRegister', data.data.user_register);
                            vm.$set('onLineUser', data.data.user_location);
                            vm.$set('orderAmount', data.data.order_amount);
                            vm.$set('monthTicket', data.data.month_ticket);
                        }
                    }
                })
            },
            getOnlinePerson: function () {
                var vm = this;
                return {
                    //backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: [
                        'rgba(255, 255, 255, 0.8)',
                        'rgba(14, 241, 242, 0.8)',
                        'rgba(37, 140, 249, 0.8)'
                    ],
                    /*                    tooltip : {
                                            trigger: 'item'
                                        },*/
                    title: {
                        text: '四子王旗在线游客统计图',
                        x: 'center',
                        y: 'bottom',
                        padding: [0, 0, 40, 0],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    legend: {
                        show: false,
                        orient: 'vertical',
                        x: 'left',
                        data: ['四子王旗'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    series: [
                        {
                            name: '四子王旗',
                            type: 'map',
                            mapType: '四子王旗',
                            roam: false,
                            hoverable: false,
                            mapLocation: {
                                x: 'center', y: 'top', height: '75%'
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: 'rgba(100,149,237,1)',
                                    borderWidth: 1.5,
                                    areaStyle: {
                                        color: 'rgba(0, 0, 0, 0.0)'
                                    }
                                }
                            },
                            data: [],
                            markPoint: {
                                symbolSize: 2,
                                large: true,
                                effect: {
                                    show: true
                                },
                                data: vm.onLineUser
                            }
                        },
                        /*                        {
                                                    name: '全国各省到黄平旅游人数',
                                                    type: 'map',
                                                    mapType: 'huangpingxian',
                                                    roam: true,
                                                    data:[],
                                                    markPoint : {
                                                        symbol:'emptyCircle',
                                                        symbolSize : function (v){
                                                            return 1 + v/20
                                                        },
                                                        effect : {
                                                            show: true,
                                                            shadowBlur : 0
                                                        },
                                                        itemStyle:{
                                                            normal:{
                                                                label: {
                                                                    show: true
                                                                }
                                                            },
                                                            emphasis: {
                                                                borderWidth:2,
                                                                borderColor:'#fff',
                                                                color: '#32cd32',
                                                                label: {
                                                                    show: false,
                                                                    textStyle: {
                                                                        color: '#fff'
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        data : vm.onLineUser
                                                    }
                                                }*/
                    ]
                }
            },
            getUserFrom: function () {
                var vm = this;
                var formCity = [], personNum = [];
                jQuery.each(vm.userFrom, function (i, item) {
                    formCity.push([{name: item.name}, {name: '四子王旗'}]);
                    personNum.push({name: item.name, value: item.total});
                });
                return {
                    //backgroundColor: '#202020',
                    color: ['gold', 'aqua', 'lime'],
                    title: {
                        text: '四子王旗游客来源分布图',
                        x: 'center',
                        y: 'bottom',
                        padding: [0, 0, 20, 0],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params, ticket, callback) {
                            var title = '';
                            if (ticket != ':0') {
                                title = params[1] + '到四子王旗<br/>' + '游客总数：' + params[2] + '万人';
                            }
                            return title;
                        }
                    },
                    dataRange: {
                        show: false,
                        min: 0,
                        max: 100,
                        calculable: true,
                        color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    series: [
                        {
                            name: '全国到四子王旗线路（虚线）',
                            type: 'map',
                            roam: false,
                            hoverable: false,
                            mapLocation: {
                                x: 'center', y: 'top', height: '85%'
                            },
                            mapType: 'china',
                            itemStyle: {
                                normal: {
                                    borderColor: 'rgba(100,149,237,1)',
                                    borderWidth: 0.5,
                                    areaStyle: {
                                        color: 'rgba(0, 0, 0, 0.0)'
                                    }
                                }
                            },
                            data: [],
                            /*  markLine : {
                                  smooth:true,
                                  symbol: ['none', 'circle'],
                                  symbolSize : 1,
                                  itemStyle : {
                                      normal: {
                                          color:'#fff',
                                          borderWidth:1,
                                          borderColor:'rgba(30,144,255,0.5)'
                                      }
                                  },
                                  data : [
                                      [{name:'北京'},{name:'四子王旗'}],
                                      [{name:'上海'},{name:'四子王旗'}],
                                      [{name:'天津'},{name:'四子王旗'}],
                                      [{name:'重庆'},{name:'四子王旗'}],
                                      [{name:'黑龙江'},{name:'四子王旗'}],
                                      [{name:'吉林'},{name:'四子王旗'}],
                                      [{name:'辽宁'},{name:'四子王旗'}],
                                      [{name:'内蒙古'},{name:'四子王旗'}],
                                      [{name:'河北'},{name:'四子王旗'}],
                                      [{name:'山西'},{name:'四子王旗'}],
                                      [{name:'山东'},{name:'四子王旗'}],
                                      [{name:'河南'},{name:'四子王旗'}],
                                      [{name:'陕西'},{name:'四子王旗'}],
                                      [{name:'甘肃'},{name:'四子王旗'}],
                                      [{name:'宁夏'},{name:'四子王旗'}],
                                      [{name:'青海'},{name:'四子王旗'}],
                                      [{name:'新疆'},{name:'四子王旗'}],
                                      [{name:'安徽'},{name:'四子王旗'}],
                                      [{name:'江苏'},{name:'四子王旗'}],
                                      [{name:'浙江'},{name:'四子王旗'}],
                                      [{name:'湖南'},{name:'四子王旗'}],
                                      [{name:'江西'},{name:'四子王旗'}],
                                      [{name:'湖北'},{name:'四子王旗'}],
                                      [{name:'四川'},{name:'四子王旗'}],
                                      [{name:'贵州'},{name:'四子王旗'}],
                                      [{name:'福建'},{name:'四子王旗'}],
                                      [{name:'台湾'},{name:'四子王旗'}],
                                      [{name:'广东'},{name:'四子王旗'}],
                                      [{name:'海南'},{name:'四子王旗'}],
                                      [{name:'广西'},{name:'四子王旗'}],
                                      [{name:'云南'},{name:'四子王旗'}],
                                      [{name:'西藏'},{name:'四子王旗'}],
                                      [{name:'香港'},{name:'四子王旗'}],
                                      [{name:'澳门'},{name:'四子王旗'}]
                                  ]
                              },*/
                            geoCoord: {
                                '四子王旗': [111.724709, 41.51597],
                                '北京': [116.4551, 40.2539],
                                '上海': [121.4648, 31.2891],
                                '天津': [117.4219, 39.4189],
                                '重庆': [107.7539, 30.1904],
                                '黑龙江': [127.9688, 45.368],
                                '吉林': [125.8154, 44.2584],
                                '辽宁': [123.1238, 42.1216],
                                '内蒙古': [111.4124, 40.4901],
                                '内蒙': [111.4124, 40.4901],
                                '河北': [114.4995, 38.1006],
                                '山西': [112.3352, 37.9413],
                                '山东': [117.1582, 36.8701],
                                '河南': [113.4668, 34.6234],
                                '陕西': [109.1162, 34.2004],
                                '甘肃': [103.5901, 36.3043],
                                '宁夏': [106.3586, 38.1775],
                                '青海': [101.4038, 36.8207],
                                '新疆': [87.9236, 43.5883],
                                '安徽': [117.29, 32.0581],
                                '江苏': [118.8062, 31.9208],
                                '浙江': [119.5313, 29.8773],
                                '湖南': [113.0823, 28.2568],
                                '江西': [116.0046, 28.6633],
                                '湖北': [114.3896, 30.6628],
                                '四川': [103.9526, 30.7617],
                                '贵州': [106.6992, 26.7682],
                                '福建': [119.4543, 25.9222],
                                '台湾': [121.3143, 25.0322],
                                '广东': [113.5107, 23.2196],
                                '海南': [110.3893, 19.8516],
                                '广西': [108.479, 23.1152],
                                '云南': [102.9199, 25.4663],
                                '西藏': [91.1865, 30.1465],
                                '香港': [114.1065, 22.1865],
                                '澳门': [113.543079, 22.207417]
                            }
                        },
                        {
                            name: '全国各省到四子王旗旅游人数',
                            type: 'map',
                            mapType: 'china',
                            data: [],
                            /*markLine : {
                                smooth:true,
                                effect : {
                                    show: true,
                                    scaleSize: 1,
                                    period: 30,
                                    color: '#fff',
                                    shadowBlur: 5
                                },
                                itemStyle : {
                                    normal: {
                                        borderWidth:1,
                                        lineStyle: {
                                            type: 'solid',
                                            shadowBlur: 5
                                        }
                                    }
                                },
                                data : formCity
                            },*/
                            markPoint: {
                                symbol: 'emptyCircle',
                                symbolSize: function (v) {
                                    return 1 + v / 20
                                },
                                effect: {
                                    show: true,
                                    shadowBlur: 0
                                },
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true
                                        }
                                    },
                                    emphasis: {
                                        borderWidth: 2,
                                        borderColor: '#fff',
                                        color: '#32cd32',
                                        label: {
                                            show: false,
                                            textStyle: {
                                                color: '#fff'
                                            }
                                        }
                                    }
                                },
                                data: personNum
                            }
                        }
                    ]
                }
            },
            getUserRegister: function () {
                var vm = this;
                var data = [],
                    value = [];
                jQuery.each(vm.userRegister.reverse(), function (i, item) {
                    data.push({'value': item.sum, 'name': item.time});
                    value.push(item.time + ' - ' + item.sum);
                });
                /*return {
                    title : {
                        text: '四子王旗每月新增用户数',
                        x: 'center',
                        y: 'bottom',
                        textStyle : {
                            color: '#fff'
                        }
                    },
                    grid: {
                        y: 35,
                        y2: 90,
                        width: '70%',
                        borderColor: '#202020'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : date,
                            axisLabel: {
                                textStyle: {
                                    color: '#fff'
                                },
                                rotate: -45
                            },
                            splitLine: {
                                lineStyle: {
                                    color: '#202020'
                                }
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}',
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: '#505050',
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        }
                    ],
                    series : [
                        {
                            name:'注册人数',
                            type:'line',
                            data: value,
                            markPoint : {
                                data : [
                                    {name : '当月注册量', value : nowMonth, xAxis: (vm.userRegister.length - 1), yAxis: nowMonth}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name : '平均值'}
                                ]
                            }
                        }
                    ]
                };*/
                return {
                    title: {
                        text: '四子王旗每月新增用户数',
                        x: 'center',
                        y: 'bottom',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    calculable: false,
                    series: [
                        {
                            name: '当月新增用户数量：',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            data: data
                        }
                    ]
                };
            },
            getOrderAmount: function () {
                var vm = this;
                var date = [],
                    value = [];
                jQuery.each(vm.orderAmount.reverse(), function (i, item) {
                    date.push(item.time);
                    value.push(parseInt(item.sum));
                });
                var nowMonth = vm.orderAmount[vm.orderAmount.length - 1].sum;
                return {
                    title: {
                        text: '四子王旗每月销售总金额（万）',
                        x: 'center',
                        y: 'bottom',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    grid: {
                        y: 35,
                        y2: 90,
                        width: '70%',
                        borderColor: 'rgba(0, 0, 0, 0)'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            data: date,
                            axisLabel: {
                                textStyle: {
                                    color: '#fff'
                                },
                                rotate: -45
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(0, 0, 0, 0)'
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} 万元',
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '当月营业额',
                            type: 'bar',
                            data: value,
                            itemStyle: {
                                normal: {
                                    color: '#00B334'
                                }
                            },
                            markPoint: {
                                itemStyle: {
                                    normal: {
                                        color: '#00B334'
                                    }
                                },
                                data: [
                                    {
                                        name: '当月营业额',
                                        value: nowMonth,
                                        xAxis: (vm.orderAmount.length - 1),
                                        yAxis: nowMonth
                                    }
                                ]
                            },
                            markLine: {
                                itemStyle: {
                                    normal: {
                                        color: '#f5f5dc'
                                    }
                                },
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                };
            },
            getTotalTicket: function () {
                var vm = this,
                    num = vm.totalTicket;
                jQuery.ajax({
                    url: 'http://backendhp.ztxywy.net/apps/operation/count/get_ticket',
                    data: {value: vm.totalTicket},
                    type: 'post',
                    async: false,
                    dataType: 'JSONP',
                    success: function (data) {
                        if (data.code == 200) {
                            num = data.data.total.amount;
                            vm.$set('totalTicket', data.data.total.amount)
                        }
                    }
                });
                return num;
                //ticketNum.roll(vm.totalTicket);
                //ticketNum.roll(fRandomBy(0,9999999))

            },
            getAge: function () {
                return {
                    title: {
                        text: '游客各年龄段比例分布图',
                        x: 'center',
                        y: 'bottom',
                        //padding: [0,0,40,0],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: ['18岁以下', '18-25岁', '26-35岁', '36-45岁', '46-55岁', '56岁以上'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    calculable: true,
                    color: ['#D87A80', '#608FE2', '#00B334', '#DA70D6', '#FFB980', '#B6A2DE'],
                    series: [
                        {
                            name: '游客各年龄段比例分布图',
                            type: 'pie',
                            radius: ['60%', '75%'],
                            center: ['50%', '45%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        position: 'center',
                                        textStyle: {
                                            fontSize: '30',
                                            fontWeight: 'bold'
                                        }
                                    }
                                }
                            },
                            data: [
                                {value: 108, name: '18岁以下'},
                                {value: 151, name: '18-25岁'},
                                {value: 556, name: '26-35岁'},
                                {value: 122, name: '36-45岁'},
                                {value: 223, name: '46-55岁'},
                                {value: 437, name: '56岁以上'}
                            ]
                        }
                    ]
                };
            },
            getFuture: function () {
                return {
                    title: {
                        text: '未来一周客流量预测（万人）',
                        x: 'center',
                        y: 'bottom',
                        //padding: [0,0,40,0],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        y: 35,
                        y2: 90,
                        width: '70%',
                        borderColor: 'rgba(0, 0, 0, 0)'
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: ['第1天', '第2天', '第3天', '第4天', '第5天', '第6天', '第7天'],
                            axisLabel: {
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(0, 0, 0, 0)',
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '预测旅游人数',
                            type: 'line',
                            smooth: true,
                            itemStyle: {
                                normal: {
                                    color: 'rgba(1,89,134,1)',
                                    lineStyle: {
                                        color: 'rgba(1,89,134,1)'
                                    },
                                    areaStyle: {
                                        //type: 'default',
                                        color: 'rgba(1,89,134,0.3)'
                                    }
                                }
                            },
                            data: [fRandomBy(10, 13), fRandomBy(10, 12), fRandomBy(10, 13), fRandomBy(10, 13), fRandomBy(10, 14), fRandomBy(10, 12), fRandomBy(10, 12)]
                        }
                    ]
                };
            },
            getmonthTicket: function (type) {
                if (!type) return
                var vm = this;
                var date = [],
                    amount = [],
                    money = [];
                jQuery.each(vm.monthTicket, function (i, item) {
                    date.push(item.time);
                    amount.push(parseFloat(item.amount));
                    money.push(parseFloat(item.money));
                });
                var nowMonth = vm.monthTicket[0].amount;
                var _money = vm.monthTicket[0].money;
                if (type == 'amount') {
                    return {
                        title: {
                            text: '四子王旗每月售票量（万张）',
                            x: 'center',
                            y: 'bottom',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        grid: {
                            y: 35,
                            y2: 90,
                            borderColor: 'rgba(0, 0, 0, 0)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        calculable: true,
                        xAxis: [
                            {
                                type: 'category',
                                data: date.reverse(),
                                axisLabel: {
                                    textStyle: {
                                        color: '#fff'
                                    },
                                    rotate: -45
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                axisLabel: {
                                    formatter: '{value} /万张',
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: 'rgba(255, 255, 255, 0.3)'
                                    }
                                }
                            }
                        ],
                        series: [
                            {
                                name: '出票量',
                                type: 'bar',
                                data: amount.reverse(),
                                markPoint: {
                                    data: [
                                        {
                                            name: '当月出票量',
                                            value: nowMonth,
                                            xAxis: (vm.monthTicket.length - 1),
                                            yAxis: nowMonth
                                        }
                                    ]
                                },
                                markLine: {
                                    data: [
                                        {type: 'average', name: '平均值'}
                                    ]
                                }
                            }
                        ]
                    };
                } else if (type == 'money') {

                    return {
                        title: {
                            text: '四子王旗每月售票金额（万元）',
                            x: 'center',
                            y: 'bottom',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        grid: {
                            y: 35,
                            y2: 90,
                            borderColor: 'rgba(0, 0, 0, 0)'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        calculable: true,
                        xAxis: [
                            {
                                type: 'category',
                                data: date.reverse(),
                                boundaryGap: false,
                                axisLabel: {
                                    textStyle: {
                                        color: '#fff'
                                    },
                                    rotate: -45
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                axisLabel: {
                                    formatter: '{value} 万元',
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: 'rgba(255, 255, 255, 0.3)'
                                    }
                                }
                            }
                        ],
                        series: [
                            {
                                name: '售票金额',
                                type: 'line',
                                data: money.reverse(),
                                itemStyle: {
                                    normal: {
                                        color: '#6495ED'
                                    }
                                },
                                markPoint: {
                                    itemStyle: {
                                        normal: {
                                            color: '#6495ED'
                                        }
                                    },
                                    data: [
                                        {
                                            name: '当月售票金额',
                                            value: _money,
                                            xAxis: (vm.monthTicket.length - 1),
                                            yAxis: _money
                                        }
                                    ]
                                },
                                markLine: {
                                    itemStyle: {
                                        normal: {
                                            color: '#f5f5dc'
                                        }
                                    },
                                    data: [
                                        {type: 'average', name: '平均值'}
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        },
        data: {
            loading: true,
            mapHeight: '200px',
            totalTicket: '',
            userFrom: [],
            userRegister: [],
            onLineUser: [],
            orderAmount: [],
            monthTicket: []
        }
    });

    function fRandomBy(under, over) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * under + 1);
            case 2:
                return parseInt(Math.random() * (over - under + 1) + under);
            default:
                return 0;
        }
    }
});
