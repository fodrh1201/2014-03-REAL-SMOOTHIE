var SelectorLayer = cc.LayerColor.extend({
	ctor:function () {
		this._super(cc.color(255, 0, 0, 220));
		this.init();
		
	},

	init: function() {
		// 캐릭터 선택창 설정
		var winsize = cc.director.getWinSize();
		this.setContentSize(winsize);
		this.selectedChar =[];
		var touchListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) { 
				// 모든 터치이벤트리스너를 돌며 이 파이프를 선택한 것인지 계산한다.
				var target = event.getCurrentTarget();
				var locationInNode = target.convertToNodeSpace(touch.getLocation());    

				for(var i in target.children) {
					var pos = target.children[i].getPosition();
					var size = target.children[i].getContentSize();
					var rect = cc.rect(pos.x-(size.width/2), pos.y-(size.height/2), size.width, size.height);
					
					if (cc.rectContainsPoint(rect, locationInNode)) {
						if(target.children[i].type.SALLY) {
							cc.audioEngine.playEffect(res.button_mp3);
							for(var j =0 ; j< this.selectedChar.length ; j++) {
								if(this.selectedChar[j] == false) {
									var char = new Friend(target.children[i].type.SALLY);
									char.setPositionByRowCol(2, 3+j);
									this.selectedChar[j] = char;
									this.addChild(this.selectedChar[j]);
									break;
								}
							}
						} else if(target.children[i].type) {
							cc.audioEngine.playEffect(res.button_mp3);
							for(var j =0 ; j< this.selectedChar.length ; j++) {
								if(this.selectedChar[j].col == target.children[i].col){
									this.removeChild(this.selectedChar[j]);
									this.selectedChar[j] = false;
								}
							}
						}
						return true;
					}
				}
				return false;
			}.bind(this),
		});
		cc.eventManager.addListener(touchListener.clone(), this);

		this.SelectorLabel = new cc.LabelTTF();
		this.SelectorLabel.setFontName(res.LINEBold_ttf);
		this.SelectorLabel.setFontSize(50);
		this.SelectorLabel.setColor( cc.color(20, 20, 20));
		this.SelectorLabel.setString("Character Selector");

		// position the label on the center of the screen
		this.SelectorLabel.x = winsize.width / 2;
		this.SelectorLabel.y = winsize.height / 2 + 250;
		// add the label as a child to this layer
		this.addChild(this.SelectorLabel);
		
		var size = Object.size(SAVE.FRIENDS);
		var yPosition = 3;
		for(var i in SAVE.FRIENDS) {
			var char = new Friend(SAVE.FRIENDS[i].type);
			char.setPositionByRowCol(4, yPosition);
			this.addChild(char);
			yPosition++;
		}
		
		var count = 0;
		for(var i in SMTH.STATUS.CURRENT_LEVEL.MAP) {
			for(var j in SMTH.STATUS.CURRENT_LEVEL.MAP[i]){
				if(SMTH.STATUS.CURRENT_LEVEL.MAP[i][j] == BLOCK.TYPE.FRIEND.SALLY) {
					count++;
					this.selectedChar.push(false);
				}
			}
		}
		var yPosition = 3;
		for(var i=0 ; i < count ; i++) {
			block = new Isolation(0);
			block.setPositionByRowCol(2, yPosition+i);
			this.addChild(block);
		}

		var playNextNormal = new cc.Sprite(res.nextNormal_png);
		var playNextSelected = new cc.Sprite(res.nextSelected_png);
		var playNextDisabled = new cc.Sprite(res.nextNormal_png);
		var playNext = new cc.MenuItemSprite(playNextNormal, playNextSelected, playNextDisabled,
				function(){this.touchEvent();}.bind(this) );

		var menu = new cc.Menu(playNext);
		this.addChild(menu, 1, 2);
		menu.x = winsize.width / 2;
		menu.y = winsize.height / 2 - 250;
		
	},
	
	test: function() {
		cc.log("test Character Selector");
		return true;
	},

	touchEvent: function(touch, event) {
		//선택에 따른 이벤트 발생 게임시작
		for(var j =0 ; j< this.selectedChar.length ; j++) {
			if(this.selectedChar[j] == false) return;
		}
		cc.audioEngine.playEffect(res.button_mp3);
		this.parent.removeChild(this);
//		cc.director.runScene(new PlayScene());
	}
});