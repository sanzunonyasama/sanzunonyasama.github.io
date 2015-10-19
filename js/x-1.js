/**
 * Created by kawagiri on 15/10/18.
 */
var time = 0;
var mood = 0;
var hunger = 0;
var mono = 0;
var obj = 0;
var person = 0;
var tmp_for_story_exp_sync = 0;

var step = 0;


var selected =[0,0,0,0,0,0];

//名字
var noun={
    P:[["老师","校长","教导主任","班主任"],
        ["黛西","阿楠","塔芙","罗斯奈"]
    ],
    O:[
        ["汉堡","汉堡包","面包夹肉","好吃的带馅面包"],
        ["书","杂志","手册","画册"],
    ],
    T:["早上","中午","傍晚"],
    M:["心情不快","心情一般","心情愉快"],
    H:["饥饿","不饿","吃撑"],
    prc:[
            ["一开始","之后","过了一会儿","然后"],
            ["又过了会儿","接着","之后","然后"],
            ["最后","再过了会儿","接着","后来"]
        ]
};

//P0 老师 P1 同学
//T0 早上 T1 中午 T2 晚上
//M0 难过 M1 一般 M2 开心
//O0 汉堡 O1 书本
//H0 很饿 H1 一般 H2 很饱
// 出现//的后面是隐含要求


//模式
var sentence = [
    [
        ["P*,T*好...呜呜","碰到了P*，却没好好打招呼。","M0"],
        ["P*...T*好...","遇见了P*，他说我没什么精神呐。","M0"],
        ["P*T*好...","遇上了P*，他好像也不太开心啊。","M0"],
        ["呜呜，T*好...P*～","心情不好，碰到了T*，却差点忘了他是谁呢。","M0"],
        ["P*,T*好!","遇到了P*，不过他好像没有注意到我？","M1"],
        ["T*好,P*!","嘿嘿，然后碰到了P*啦，打了个招呼。","M1"],
        ["T*好!","路上正巧碰到了P*,似乎忘了称呼他呢。他看上去心情也不错。","M1"],
        ["P*你好～","遇到P*了，打了个招呼。","M1"],
        ["P*T*好～","遇到了P*，他看上去很高兴呢。","M2"],
        ["T*好,P*!!","路上遇见了P*,很有精神地打了一个招呼。","M2"],
        ["P*T*好!一个暑假没见到啦！","在路上竟然碰到了好久不见的P*,好开心!","M2"],
        ["T*——好——！","然后见到了P*,非常高兴。","M2"]
    ],//碰到人物的时候
    [
        ["太棒了，我看到了一个O0!正饿着呢。","发现了一个O0,正好饿着呢，我就把他吃啦","H0O0","H+"],
        ["嘿，你看这是什么？一个O0!正饿着呢。","找到了一个O0,正饿着呢，太棒了。","H0O0","H+"],
        ["不知道谁掉了一个O0？虽然想吃掉它，但是...","捡到了一个O0，虽然很饿但是还是还给他的主人吧。","H0O0"],
        ["发现了一个O0!闻起来很不错呢。","在路上发现了一个O0,虽然不饿，不过太香啦，我就把他吃掉了。","H1O0","H+"],
        ["这是什么？似乎是个O0呢!","捡到了一个O0。谁这么粗心掉了O0呢？","H1O0"],
        ["太棒了，我看到了一个O0!","碰巧看到了一个O0。哎呀，不管是谁的，我把它吃掉啦。","H1O0","H+"],
        ["咦？谁的O0？","不知道谁掉的O0。不过吃的好饱，一点也没有食欲呢。","H2O0"],
        ["哈，这里有一个O0呢。","看到了一个O0。可惜我已经吃饱啦，就不管它了。","H2O0"],
        ["看到了一个O0!","发现了一个O0,正好饿着呢，我就把他吃啦","H2O0"],
        ["咦？有一本O1？","看到了不知道谁掉的O1，心里一定很急吧","O1"],
        ["哈，有一本O1呢！","看到了一个O1。很喜欢，就带走啦。","O1"],
        ["怎么有一本O1？真巧，带回去读一读吧","找到了一本O1,我就把它带回去读了。","O1"],
    ],//碰到物体的时候
    [
        ["啊，走路没注意，掉进喷泉的池子里了，浑身湿透，现在又冷又饿。","在花园走路的时候没注意，一不小心摔倒了喷泉的水池里，浑身都湿啦。又冷又饿，心情简直差到了极点","H0"],
        ["突然闻到了一阵香味，有点饿啦。但是找不到哪来的香味，真扫兴。","突然闻到了一阵香味，我却始终找不到香味是哪来的，真是一种煎熬，不开心。","H1"],
        ["啊，不小心在花园里摔了一跤。新衣服弄脏啦。","在小径上走的时候没注意，绊到了一个石头，摔了一跤，新衣服上都是泥，心情差极了。","H2"],
    ],
    [
        ["想起来早上在自己的口袋里藏了好几块巧克力！正好饿的不行，太棒了！","想起来早上在自己的口袋里藏了好几块巧克力！正好饿的不行，太棒了！","H0","H+"],
        ["听说我的作业被表扬啦。","同学来告诉我，我的作业被表扬了，心里别提有多高兴了。","H1"],
        ["听说明天放假啦，真是太开心了！","突然听到广播里说，明天放假啦。真是突如其来的好消息，太开心了！","H2"],
    ],//碰到心情的时候
    [
        ["","不知道为什么，今天心情不太好。T*饭也没吃就去了学校。","M0H0"],
        ["","来不及啦，T*饭也没吃就去了学校。","M1H0"],
        ["","今天是开学第一天，T*饭也没吃就兴高采烈地去了学校。","M2H0"],
        ["","不想上学。但还是不甘愿地在T*去了学校。","M0H1"],
        ["","T*去了学校。","M1H1"],
        ["","开学啦！开开心心去学校！","M2H1"],
        ["","吃地太撑啦，真不想去学校。","M0H2"],
        ["","吃地好饱，去学校咯。","M1H2"],
        ["","大T*的，好好地吃了一顿，之后蹦蹦跳跳地来到了学校。","M2H2"]
    ],//开场
    [
        ["","哎，真是倒霉的一天。又饿又累，不开心。","M0H0"],
        ["","虽然还是很饿，但今天过地还不错～","M1H0"],
        ["","虽说饿着肚子，今天还是非常开心的！","M2H0"],
        ["","今天真没意思。","M0H1"],
        ["","嘛，今天还是挺愉快的。","M1H1"],
        ["","太棒了！学校真开心！","M2H1"],
        ["","肚子撑的难受，今天真是不怎么愉快。","M0H2"],
        ["","算是不错的一天吧。","M1H2"],
        ["","今天就是特别开心！！特！别！开！心！","M2H2"]
    ]
];



function rand(maxnum){
    return parseInt(Math.random() * maxnum);
}

function getName(lab){
    if(lab==undefined)return;
    console.log(lab);
    return lab[tmp_for_story_exp_sync % lab.length];
}

function getReplace(str){

    str = str.replace("P*","P" + person);
    str = str.replace("O*","O" + obj);
    str = str.replace("T*","T" + time);

    for(var i  = 0;i < 3; i++){
        str = str.replace("T" + i ,noun.T[i]);
        str = str.replace("O" + i ,getName(noun.O[i]));
        str = str.replace("P" + i ,getName(noun.P[i]));
    }

    return str;
}

function getSentence(data){

    for(;;){
        var pass = true;
        var i =  parseInt(Math.random() * data.length);
        console.log(data[i][0]);
        var tot = data[i][2].length;
        for(var j = 0;j  < tot ; j+=2){

            switch (data[i][2][j]) {
                case 'M':
                    if(data[i][2][j + 1] != mood)pass = false;
                    break;
                case 'H':
                    if(data[i][2][j + 1] != hunger)pass = false;
                    break;
                case 'O':
                    if(data[i][2][j + 1] != obj) pass = false;
                    break;
            }
        }
        console.log(pass);

        if(pass == false)
            continue;


        addText(getReplace(data[i][1]),"storyboard");
        addText(getReplace(data[i][0]),"expboard");
        tmp_for_story_exp_sync++;
        if(data[i][3] != undefined) {
            hunger++;
            $("#hunger").text(noun.H[hunger]);
        }
        break;

    }
}


function getSuc(step){
    return noun.prc;
}

function addText(txt,pos){
    var oritext = $("#" + pos).html();
    if(step > 0 && step < 3 && pos == "storyboard")oritext += '<br/><br/>' + noun.prc[step-1][parseInt(Math.random()*4)] + "," + txt;
    else oritext += '<br/><br/>' + txt;
    $("#" + pos).html(oritext);
}


function fresh(){//每次选择步骤之前执行



    $($(".container > .row")[step]).removeClass("hidden");

    for(var i = 0;i < 6; i++){


        //console.log($(".container  .row:nth-child(" + step  +") .select-button").attr("class"));
        if(selected[i] == 0)
        $($(".select-button",$(".container > .row")[step])[i]).addClass("active");
    }
    //确定哪些可选择



    $(".select-button",$(".container > .row")[step]).bind("click",function(){
        $(".select-button",$(".container > .row")[step]).removeClass("active");
        $(this).addClass("selected");
        $(".select-button",$(".container > .row")[step]).unbind("click");
        //先锁定其他区域


        for(var i  = 1;i < 5; ++i)
            if($(this).hasClass("r" + i)){
                selected[i - 1] = 1;
                //锁定该选项
                obj = i - 3;
                person = i - 1;
                console.log(i,sentence[parseInt((i-1)/2)]);

                getSentence(sentence[parseInt((i-1)/2)]);
            }


        for(var i  = 5;i < 7; ++i)
            if($(this).hasClass("r" + i)){
                selected[i - 1] = 1;
                //锁定该选项

                getSentence(sentence[i - 3]);
                mood += i * 2 - 11;
                $("#mood").text(noun.M[mood]);
            }
        $("#tuduke").trigger("click");

        var scrollTop = $("body")[0].scrollHeight;
        $("body").scrollTop(scrollTop);

    });



}


function init(){
    time = rand(3);
    mood = rand(3);
    hunger = rand(3);
    $("#mood").text(noun.M[mood]);
    $("#hunger").text(noun.H[hunger]);
    $("#time").text(noun.T[time]);
    getSentence(sentence[4]);
    step++;
    $("#owari").click(function(){
        $("#storyboard").removeClass("hidden");
    });
    fresh();
    $("#tuduke").click(function(){
        if(step==3){
            $("#owari").trigger("click");
            return false;
        }
        step++;
        fresh();

    });

    $("#owari").click(function(){
        $(this).addClass("disabled");
        $(this).unbind("click");
        step++;
        getSentence(sentence[5]);
        $("#storyboard").removeClass("hidden");

        $(".select-button").removeClass("active");
        $(".select-button").unbind("click");
    });


}















init();

