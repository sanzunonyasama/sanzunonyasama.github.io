/**
 * Created by kawagiri on 15/7/28.
 */

var dirx = [-1,0,1,1,0,-1];
var diry = [-1,-1,0,1,1,0];
var polygonheight = 135.2;
var polygonwidth = 117.6;
var polygonfuzajisuande = 111.8;//sqrt(3)/2 * 135.2
var charLabelheight = 129;
var charLabelwidth = 94;
var nowPlayerid = 0;
var monsterList = ["rumia","dayousei","lunarchild","nightburg","mystialorelei","starsapphire","sunnymilk"];

var playersum = 0;
var userInfo = [];


function init(){
    playersum = 0;
    userInfo = [];
    $("#mapBoard").empty();
    testDefault();
}

function gameover(){
    $("#showerror [name = 'preset']").addClass("gameover");
    $("#showerror").unbind("click");
    $("#showerror span").text("再来一局").one("click",function(){
        $("#showerror").fadeOut();
        init();
    });

    $("#showerror").fadeIn();
    return false;


}

function Uppercasefirst(str){
    return str.substr(0,1).toUpperCase()+ str.substr(1,str.length - 1);

}

function showError(msg_class){
    if(msg_class == "movetimeowari"){
        $("#showerror [name = 'preset']").addClass(msg_class);
        $("#showerror").unbind("click");
        $("#showerror span").text("再来一局").one("click",function(){
            $("#showerror").fadeOut();
            init();
        });

        $("#showerror").fadeIn();
        return false;
    }

    $("#showerror [name = 'preset']").addClass(msg_class);
    $("#showerror").fadeIn(function(){
        setTimeout(function(){
            $("#showerror").fadeOut();
            $("#showerror div").removeClass(msg_class);
        },2000);
    });
}


$("#showerror").bind("click",function(){
    $(this).fadeOut();
})

function newchar(playerid,name,char,nowx,nowy) {
    var ret = new Object();
    ret.playerid = playerid;
    ret.name = name;
    ret.health = 10;
    ret.healthMax = 10;
    ret.mahou = 3;
    ret.mahouMax = 7;
    ret.fuli = 0;
    ret.fuliMax = 3;
    ret.char = char;
    ret.actiontime = 10;
    ret.nowx = nowx;
    ret.nowy = nowy;
    ret.attackType = 0;
    ret.readyForNormalAttack = function(attackerId){

        var classname = "attacker" + userInfo[attackerId].char;
        this.realDiv.addClass(classname);

    }
    ret.attackTargetChecked = function(targetId){
        if(ret.attackType == 0){
            $("[id*='charReal'][class*='attacker']").attr("class","");
            if(ret.char == "hakureireimu"){
                var hierogram = $("<div class = 'hakureihierogram'></div>");
                $("#mapBoard").append(hierogram);
                var deg = 0;
                for(var i = 0;i < 6; ++i){
                    if(ret.nowx + dirx[i] == userInfo[targetId].nowx && ret.nowy + diry[i] == userInfo[targetId].nowy){
                        deg = -60 * i - 30;
                        break;
                    }
                }

                hierogram.css({"transform":"rotate(" + deg + "deg)","top":(parseInt(ret.realDiv.css("top")) + 20) + "px","left":(parseInt(ret.realDiv.css("left")) + 20) + "px"});
                hierogram.css("transition","opacity 0.3s,left 1s,top 1s");
                hierogram.css({"opacity":1,"top":(parseInt(userInfo[targetId].realDiv.css("top")) + 20) + "px","left":(parseInt(userInfo[targetId].realDiv.css("left")) + 20) + "px"});
                setTimeout(function(){
                    hierogram.css("opacity",0);
                    userInfo[targetId].valueChangeShowNumber(-1,-1);
                    userInfo[targetId].beAttackedBlowout(-(deg+ 30) / 60,function(targetId){
                        return function(){
                            for(var i = playersum - 1;i >=0; --i)
                                if(userInfo[i].health == 0)
                                    userInfo[i].suicide();
                        }
                    }(targetId));

                    $("[name = 'cancelbutton']",ret.realDiv).trigger("click");
                    $("[name = 'attackbutton']",ret.realDiv).trigger("click");
                    $(".hakureihierogram").remove();
                },800);
            }
        }
    }

    ret.beAttackedBlowout = function(deglab,callback){
        console.log(deglab);
        $(mapGridId(ret.nowx,ret.nowy)).removeClass("mapGridCharOn");

        ret.nowx += dirx[deglab];
        ret.nowy += diry[deglab];
        var newxpos = mapGridToPx_x(ret.nowx,ret.nowy);
        var newypos = mapGridToPx_y(ret.nowx,ret.nowy);
        ret.realDiv.css({"left":newxpos + "px","top":newypos + "px"});
        for(var i = 0;i < playersum; ++i){
            if(i != ret.playerid && userInfo[i].nowx == ret.nowx && userInfo[i].nowy == ret.nowy){
                userInfo[i].beAttackedBlowout(deglab);
                break;
            }
        }
        $(mapGridId(ret.nowx,ret.nowy)).toggleClass("mapGridCharOn",true);
        if(!$(mapGridId(ret.nowx,ret.nowy)).hasClass("mapGridUsed"))
            ret.health = 0;

        if(callback)callback();
    }

    ret.suicide = function(){
        $(mapGridId(ret.nowx,ret.nowy)).removeClass("mapGridCharOn");
        userInfo[ret.playerid].realDiv.fadeOut(function(){
            $(this).remove();
        });
        for(var i = ret.playerid;i < playersum - 1; ++i){
            userInfo[i] = userInfo[i + 1];
            if(userInfo[i] == nowPlayerid)nowPlayerid = i;
            userInfo[i].playerid = i;
        }
        playersum--;
        if(playersum == 1){
            gameover();
        }
    }

    ret.valueChangeShowNumber = function(health,mahou){
        if(mahou + ret.mahou > ret.mahouMax)mahou =ret.mahouMax - ret.mahou;
        if(mahou + ret.mahou < 0)mahou = -ret.mahou;
        if(health + ret.health > ret.healthMax)health =ret.healthMax - ret.health;
        if(health + ret.health < 0)health = -ret.health;
        if(health != 0)$("[name = 'charRealValueChange'] [name = 'health']",ret.realDiv).text(health);
        if(mahou != 0)$("[name = 'charRealValueChange'] [name = 'mahou']",ret.realDiv).text(mahou);
        ret.mahou += mahou;
        ret.health += health;
        $("[name = 'healthProgress']",ret.realDiv).css("width",(ret.health * 6 + 2) + "px");
        $("[name = 'mahouProgress']",ret.realDiv).css("width",(ret.mahou * 6 + 2) + "px");
        $("[name = 'charRealValueChange']",ret.realDiv).fadeIn(function(){
            $(this).addClass("blowout");
            setTimeout(function(){
                $("[name = 'charRealValueChange']",ret.realDiv).fadeOut(
                    function(){
                        $(this).removeClass("blowout");
                        $("[name = 'charRealValueChange'] [name = 'health']",ret.realDiv).text("");
                        $("[name = 'charRealValueChange'] [name = 'mahou']",ret.realDiv).text("");
                    }
                );

            },1000);
        });



    }
    if (ret.playerid != nowPlayerid) {
        ret.health = parseInt(Math.random() * 3) + 1, ret.healthMax = 4;
        ret.mahouMax = 2;
        ret.mahou = parseInt(Math.random() * 2) + 1;
        ret.actiontime = 0;
    }

    ret.realDiv = $("<div id ='charReal" + Uppercasefirst(ret.char) + "'>" +
        "<div name = 'charRealValueChange'><span name = 'health'></span><span name = 'mahou'></span></div><div class ='charRealPhoto'><div name = 'attackchoosed'><span></span><span></span><span></span></div>" +
        "<div name='attackbutton'></div><div name = 'dougubutton'></div><div name='statebutton'></div><div name='cancelbutton'></div>" +
        "<div name = 'charRealProgress'><div name = 'healthProgress'></div><div name = 'mahouProgress'></div></div></div>" +
        "<div class = 'charRealPropertyOnInfo'><div name ='actiontime'>" + ret.actiontime + "</div><div name='health'>" + ret.health +"/" + ret.healthMax + "</div>" +
        "<div name = 'mahou'>"+ ret.mahou + "/" + ret.mahouMax + "</div><div name = 'fuli'>" + ret.fuli + "/" + ret.fuliMax + "</div></div>" +
        "<div class = 'charRealAttackInfo'><div name ='tmpcheck'></div></div>");
    $("#mapBoard").append(ret.realDiv);

    $("[name = 'healthProgress']",ret.realDiv).css("width",(ret.health * 6 + 2) + "px");
    $("[name = 'mahouProgress']",ret.realDiv).css("width",(ret.mahou * 6 + 2) + "px");

    if(ret.playerid == nowPlayerid){
        $(".charRealPhoto [name='attackbutton']",ret.realDiv).css("display","block");
        $(".charRealPhoto [name='dougubutton']",ret.realDiv).css("display","block");
        $(".charRealPhoto [name='statebutton']",ret.realDiv).css("display","block");
    }
    ret.realDiv.css({
        "left": mapGridToPx_x(ret.nowx, ret.nowy) + "px",
        "top": mapGridToPx_y(ret.nowx, ret.nowy) + "px"
    });
    $("[name= 'statebutton']",ret.realDiv).bind("click",function(){
        $("#charReal" + Uppercasefirst(ret.char)).removeClass("charAttackClicked");
        $("#charReal" + Uppercasefirst(ret.char)).toggleClass("charClicked");
        var zindextmp = $("[id*='charReal']");
        var maxindex = 0;
        for(var i = 0;i < zindextmp.length;i++){
            var tmpnow = parseInt($(zindextmp[i]).css("z-index"));
            if(tmpnow > maxindex)maxindex = tmpnow;
        }
        $(this).css("z-index",maxindex + 1)
    });

    $(".charRealAttackInfo [name = 'tmpcheck']",ret.realDiv).bind("click",function(ret){
        return function(){
                if(!readyForNormalAttack())return false;
                ret.attackType = 0;
                $("[name = 'attackbutton']",ret.realDiv).trigger("click");
                $("[name = 'cancelbutton']",ret.realDiv).fadeIn();
        }
    }(ret));

    $("[name = 'cancelbutton']",ret.realDiv).bind("click",function(){
        readyForGo();
        $(this).fadeOut();
    });
    $("[name = 'attackbutton']",ret.realDiv).bind("click",function(){
        $("#charReal" + Uppercasefirst(ret.char)).removeClass("charClicked");
        $("#charReal" + Uppercasefirst(ret.char)).toggleClass("charAttackClicked");
        var zindextmp = $("[id*='charReal']");
        var maxindex = 0;
        for(var i = 0;i < zindextmp.length;i++){
            var tmpnow = parseInt($(zindextmp[i]).css("z-index"));
            if(tmpnow > maxindex)maxindex = tmpnow;
        }
        $(this).css("z-index",maxindex + 1)
    });

    ret.realDiv.bind("click",function(){
        if(String($(this).attr("class")).indexOf("attacker") < 0)return false;
        userInfo[nowPlayerid].attackTargetChecked(ret.playerid);
    });

    $(".charRealPhoto",ret.realDiv).css({
        "background-image":"url('./images/game1/photo/" + ret.char + ".png')"
    });

    $(mapGridId(ret.nowx, ret.nowy)).addClass("mapGridCharOn");

    if(ret.playerid == nowPlayerid){
        ret.realDiv.css("z-index",6);
    }

    userInfo[playersum++] = ret;
    return ret;
}



$("#mapChoose_Hakureijinja").bind("click",function(){
    mapChoose_Hakureijinja();
});

function testDefault(){
    mapChoose_Hakureijinja();
}

var mapSize = 15;

function mapGridId(i,j){
    return "#mapGrid" + (i * mapSize + j);
}

function mapGridToPx_x(i,j){
    return -i*(polygonwidth + 10)/2+j*(polygonwidth + 10) + (polygonwidth + 10)/2 - charLabelwidth/2 - 4;
}

function mapGridToPx_y(i,j){
    return -40+ polygonfuzajisuande * i + polygonheight/2 - 100;
}


function readyForNormalAttack() {
    if ($("[id*='mapGrid'].mapGridCanattack").length == 0) {
        showError("error_noEnemyCanNormalAttack");
        return false;
    }
    $("[id*='mapGrid'].mapGridCanreach").removeClass("mapGridCanreach");
    for(var i = 0;i < playersum;++i)
        if(i != nowPlayerid){
            if($(mapGridId(userInfo[i].nowx,userInfo[i].nowy)).hasClass("mapGridCanattack")){
                userInfo[i].readyForNormalAttack(nowPlayerid);
            }
        }
    return true;
}

function readyForGo(){
    herex = userInfo[nowPlayerid].nowx;
    herey = userInfo[nowPlayerid].nowy;

    $("[id*='charReal'][class*='attacker']").attr("class","");
    $("[id*='mapGrid'].mapGridCanattack").removeClass("mapGridCanattack");
    $("[id*='mapGrid'].mapGridCanreach").removeClass("mapGridCanreach");
    for(var i = 0;i < 6; ++i) {
        var tmpGrid = $(mapGridId(herex + dirx[i], herey + diry[i]));

        if(!tmpGrid.hasClass("mapGridCantgo")) {
            if(tmpGrid.hasClass("mapGridCharOn")){

                tmpGrid.addClass("mapGridCanattack");
            }
            else
                tmpGrid.addClass("mapGridCanreach");
        }
    }
}

function mapChoose_Hakureijinja(){


    $("#beforestart").fadeOut(function(){
        $("#playboard > div").fadeIn();
    })
    var mapBoard = $("#mapBoard");
    for(var i = 0;i < 225;++i)
        mapBoard.append("<div id='mapGrid"+i+"' class = 'mapGrid_typeMahounomori'></div>");


    for(var i = 0;i < 15;++i) {
        for (var j = 0; j < 15;j++) {
            $("#mapGrid" + (i * 15 + j), playboard).css({"left":(-i*127.6/2+j*127.6) + "px", "top":(-40+111.8 * i) + "px"});
        }
    }
    var beforeMapHeight = parseInt(mapBoard.css("height"));
    var deltaHeight = (111.8*12 + 100) - beforeMapHeight;
    var beforePlayboardHeight = parseInt($("#playboard").css("height"));
    $("#playboard").css("height",(beforePlayboardHeight + deltaHeight ) + "px");
    mapBoard.css("height",(111.8*12 + 100) + "px");


    var startx= 2,starty=3;
    for(var i = 0;i < 7; ++i){
        var jBorder = i - 3;
        if(jBorder < 0) jBorder = -jBorder;
        jBorder = 7 - jBorder;
        for(var j = 0;j < jBorder;++j) {
            var label = (i + startx) * 15 + starty + j;
            if (i > 3) label += i - 3;
            $("#mapGrid" + label).addClass("mapGridUsed");
            $("#mapGrid" + label).append("<div class = 'mapGridState'></div>");
        }
    }

    $("#mapGrid" + ((startx + 3) * 15 + starty + 3)).removeClass("mapGrid_typeMahounomori").addClass("mapGrid_typeHakureijinja");



    var getOldtreeDown = parseInt(Math.random() * 6);
    $("#mapGrid" + ((startx+3 + diry[getOldtreeDown])*15 + dirx[getOldtreeDown] + starty + 3)).removeClass("mapGrid_typeMahounomori").addClass("mapGrid_typeJinjaOldtree").addClass("mapGridCantgo");



    newchar(0,"kawagiri","hakureireimu",startx + 3,starty + 3);








    function placeMonster(){
        var tmpDone = [];
        for(var i = 0;i < monsterList.length; ++i)
            tmpDone[i] = 0;

        for(var i = 0;i < 5; ++i){
            var tmpThis = 0;
            for(;;) {
                tmpThis = parseInt(Math.random() * 7);
                if(tmpDone[tmpThis] == 0)break;
            }
            tmpDone[tmpThis] = 1;
            var tmpX, tmpY, tmpId;
            for(;;){
                tmpX = parseInt(Math.random() * 15);
                tmpY = parseInt(Math.random() * 15);
                tmpId = mapGridId(tmpX, tmpY);
                if($(tmpId).hasClass("mapGridUsed") && !$(tmpId).hasClass("mapGridCharOn")) {
                    if (monsterList[tmpThis] != "lunarchild" && monsterList[tmpThis] != "sunnymilk" && monsterList[tmpThis] != "starsapphire"
                        && $(tmpId).hasClass("mapGrid_typeJinjaOldtree"))
                        continue;
                    else break;
                }
            }
            newchar(playersum,"kawagiri",monsterList[tmpThis],tmpX,tmpY);

        }
    }
    placeMonster();

    for(var i = 0;i < 15;++i)
        for(var j = 0;j < 15; ++j){
            var tmpId = mapGridId(i,j);
            $(tmpId).data({"cordx":i,"cordy":j});
            if($(tmpId).hasClass("mapGridUsed") && $(tmpId).hasClass("mapGridCantgo")==false){
                $(tmpId).bind("click",function(){
                    var herex = $(this).data("cordx"),herey = $(this).data("cordy");

                    if($(this).hasClass("mapGridCanreach")){

                        if(userInfo[nowPlayerid].actiontime<= 0){
                            showError("movetimeowari");
                            return false;
                         }
                        userInfo[nowPlayerid].actiontime--;
                        $(".charRealPropertyOnInfo [name = 'actiontime']",userInfo[nowPlayerid].realDiv).text(userInfo[nowPlayerid].actiontime);

                        $(mapGridId(userInfo[nowPlayerid].nowx,userInfo[nowPlayerid].nowy)).removeClass("mapGridCharOn");

                        $(this).removeClass("mapGridCanreach").addClass("mapGridCharOn");
                        userInfo[nowPlayerid].nowx = herex;
                        userInfo[nowPlayerid].nowy = herey;
                        $("#charRealHakureireimu").css({"left":mapGridToPx_x(herex,herey),
                            "top":mapGridToPx_y(herex,herey)});

                        readyForGo();
                    }
                });
            }
        }


    readyForGo();

}



init();
