window.onload = function(){
    var btnToTop = document.getElementById('scroll-to-top');
    // var showHeigth = document.documentElement.clientHeight;
    var showHeigth = 300;
    var timer = null;
    var isTop = true;

    window.onscroll = function(){
        var osTop = document.documentElement.scrollTop || document.body.scrollTop; 

        if(osTop >= showHeigth){
            btnToTop.style.display = 'block';
        }else{
            btnToTop.style.display = 'none';
        }

        if(!isTop){
            clearInterval(timer);
        }
        isTop = false;
    }

    btnToTop.onclick = function(){
        timer = setInterval(function(){
            var osTop = document.documentElement.scrollTop || document.body.scrollTop;
            var speed = Math.floor(-osTop / 6);
            document.documentElement.scrollTop = document.body.scrollTop = osTop + speed;
            isTop =true;
            if(osTop == 0){
                clearInterval(timer);
            }
        },10);
    }

    btnToTop.style.display = (document.documentElement.scrollTop || document.body.scrollTop) >= showHeigth ? 'block' : 'none';
}