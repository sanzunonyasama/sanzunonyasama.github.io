/**
 * Created by kawagiri on 15/10/18.
 */
var time = 0;
var mood = 0;
var hunger = 0;
var weather = 0;
var obj = 0;
var person = 0;
var tmp_for_story_exp_sync = 0;

var step = 0;


var selected =[0,0,0,0,0,0];

//名字
var noun = {
    W:["sunny","rainy"],
    P:[[" Miss White "," Mr Smith "," Mr Black "," Miss Wang "],
        ["Daisy","Mike","Yang","Rose"]
    ],
    O:[
        [" burger "," hamburger "," hot dog "," sandwich "],
        [" book "," magazine "," notebook "," picture book "],
    ],
    T:["Morning","Afternoon","Night"],
    M:["Bad","Normal","Good"],
    H:["Hungry","Normal","Full"],
    prc:[
            ["At first ","First,","Next ","Then "],
            ["Then ","Later ","Next ","After that,"],
            ["And then ","Later,","Next,","In no time, "],
            ["Soon after,","After a while, ","Later,","After that "],
            ["Afterward ","Soon after,","Later ","After that"],
            ["At last ","After that,","In the end,","Finally,"],

        ]
};

//P0 teacher    P1 student
//T0 morning    T1 afternoon    T2 night
//M0 sad        M1 normal       M2 happy
//O0 burger     O1 book
//H0 hungry     H1 normal       H2 full


//模式





var sentence = [
    [
        ["Good T*... P*. ",                         "I met P* and said hello to him.",                                               "M0"],

        ["Good T*... Oh I hate rainy days.",        "I met P*. We talked about the awful weather.",         "M0W0"],

        ["P*, Good T* ...",                         "I met P* accidently. ",                                "M0W1"],

        ["Good T*...",                              "I met P*. He looked unhappy as me.",                   "M0"],
        ["Hmmmm，Good T* ... ","I met P*. But I'm sad so I didn't greet him well.","M0"],
        ["Hey!P*!Here! Good T* ! ","I saw P*，but he didn't seem to see me.","M1"],
        ["Good T* ,P*!","I saw P*! We chatted happily.","M1"],
        ["Good T*!","I met P* accidently. He looked so happy!","M1"],
        ["Hello, P*!","I said hello to P*. ","M1"],
        ["Hey! Good T*, P*!","I met P* and we talked for a long time. He was very happy.","M2"],
        ["Hey,P*!","I met P* and gave her a big hug!","M2P1"],
        ["Good T* ,P*!  Long time no see!","I met my old friend P*. I was very happy.","M2"],
        ["Good T*! It's a nice day.","I met P* and we talked about the weather. ","M2W0"]
    ],//Meet people
    [
        [" I'm just hungry. I bought a O0 in the canteen.","I bought a O0 in the canteen. The O0 is delicious.","H0O0","H+"],
        [" Great! I found a O0!","I found a O0. I'm just hungry so I ate it. ","H0O0","H+"],
        [" Oh no. I have no money for a O0.","I got to the canteen, but I have no money for a O0. ","H0O0"],
        [" The O0 smells good! I will eat it. ","I found a O0 on the road and ate it. I'm really lucky. ","H1O0","H+"],
        [" Who lost a O0 here?","。I found a O0 on the road. ","H1O0"],
        [" My friend gave me a O0. I'm so happy. ","I met Daisy accidently and she gave me a O0. It's delicious and I'm very happy. ","H1O0","H+"],
        [" My friend Daisy gave me a O0. I put it into my bag. ","My friend Daisy gave me a O0. I'm full now so I put it into my bag. ","H2O0"],
        [" I see a O0 but I'm full now.。","I saw a O0, but I'm full so I ignored it","H2O0"],
        ["Oh,I found a O0!","I found a O0 and I took it home","H2O0"],
        ["Here's a O1!","I found a O1. Who lost it?","O1"],
        ["My teacher gave me a O1. ","My teacher gave me a O1 and I took it home. ","O1"],
    ],//meet an object
    [
        ["Oh no ! I fall in the rain and get wet.Bad luck.","I had a bad fall in the rain and got wet.Bad luck.","H0W1","M-"],
        ["Oh no ! I fall in the garden and  get a pain in my leg. ","I had a bad fall in the garden and got a pain in my leg.Bad luck.","H0W0","M-"],
        ["I can't find my wallet!","I lost my wallet. Fortunately there's no money in it.","H1","M-"],
        ["I messed up my new dress with juice on the road.","I messed up my new dress with juice on the road. I would be scolded by my mother. So sad.","H2","M-"],
    ],
    [
        ["I'm just hungry now, and suddenly I find some chocolate in my pocket.","I find some chocolate in my pocket. I remembered that my mother put them on the morning.That's great!","H0","H+","M+"],
        ["I met my math teacher and he praised me for my homework.","I met my math teacher and he praised me for my homework. I'm so happy!","H1","M+"],
        ["There will be a spring outing tomorrow! How exciting it is! ","My friend told me that there's a spring outing tomorrow! How exciting it is!","H2","M+"],
    ],//meet a mood label
    [
        ["","It's a nice day ,but not for me. And I'm on an empty stomach now.","M0H0W0"],
        ["","I came to school without eating anything. I'm starving and I'm so sad just like the foul weather. ","M0H0W1"],
        ["","I had no time for a meal and went to school in a rush.","M1H0"],
        ["","I love school so much that I get school without my meal ","M2H0"],
        ["","I don't like school but I‘m still here.","M0H1"],
        ["","W* day! I think I will have a good school day.","M1H1"],
        ["","I got a great meal and then got to the school.","M2"],
        ["","I'm too full to move. But I had to go to school.","M0H2"],
        ["","Today is a shining day and I got to the school.","M1H2W0"],
        ["","Today is a rainy day and I got to the school.","M1H2W0"],
        ["","I had a big meal and went to school with excitement.","M2H2"]
    ],//Diary beginning
    [
        ["","What a bad day. I'm hungry and tired. Sad...","M0H0"],
        ["","Though I'm hungry now , it's still a good day.","M1H0"],
        ["","Though I'm hungry now, I'm in a wonderful mood just like the sunny day!","M2H0W0"],
        ["","I feel good today. Rainy day can be a nice day too! ","M2H0W1"],
        ["","What a boring day.","M0H1"],
        ["","School is interesting. Today I'm very happy. ","M1H1"],
        ["","I'm so happy today in the school!","M2H1"],
        ["","I ate too much, my stomach was uncomfortably distended. Bad day.","M0H2"],
        ["","I had a Good day.","M1H2"],
        ["","I had a wonderful day. ","M2H2"]
    ]//Diary ending
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
    str = str.replace("W*","W" + weather);

    for(var i  = 0;i < 6; i++){
        str = str.replace("T" + i ,noun.T[i]);
        str = str.replace("O" + i ,getName(noun.O[i]));
        str = str.replace("P" + i ,getName(noun.P[i]));
        str = str.replace("W" + i ,getName(noun.W[i]));
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
                case 'W':
                    if(data[i][2][j + 1] != weather) pass = false;
                    break;
            }
        }
        console.log(pass);

        if(pass == false)
            continue;


        addText(getReplace(data[i][1]),"storyboard");
        addText(getReplace(data[i][0]),"expboard");
        tmp_for_story_exp_sync++;
        if(data[i][3] != undefined){
            if(data[i][3][0] == 'H')
            {
                hunger++;
                $("#hunger").text(noun.H[hunger]);
            }
            else{
                if(data[i][3][1] == '-' && mood > 0){
                    mood --;
                    $("#mood").text(noun.M[mood]);
                }
                if(data[i][3][1] == '+' && mood < 2){
                    mood ++;
                    $("#mood").text(noun.M[mood]);
                }
            }
        }
        break;

    }
}


function getSuc(step){
    return noun.prc;
}

function addText(txt,pos){
    var oritext = $("#" + pos).html();
    if(step > 0 && step < 7 && pos == "storyboard")oritext += '<br/><br/>' + noun.prc[step-1][parseInt(Math.random()*4)] + "" + txt;
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
    weather = rand(2);
    $("#mood").text(noun.M[mood]);
    $("#hunger").text(noun.H[hunger]);
    $("#time").text(noun.T[time]);
    $("#weather").text(noun.W[weather]);
    getSentence(sentence[4]);
    step++;
    $("#owari").click(function(){
        $("#storyboard").removeClass("hidden");
    });
    fresh();
    $("#tuduke").click(function(){
        if(step==6){
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

