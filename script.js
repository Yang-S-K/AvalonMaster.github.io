document.addEventListener("DOMContentLoaded", () => {
    const characters = document.querySelectorAll('.character');
    const confirmButton = document.getElementById('confirm-selection');
    const characterSelection = document.getElementById('character-selection');
    const gameGuide = document.getElementById('game-guide');
    const guideText = document.getElementById('guide-text');
    const playPauseButton = document.getElementById('play-pause-voice');
    const stopVoiceButton = document.getElementById('stop-voice');
    const backButton = document.getElementById('back-to-selection');
    const lancelotVariantSection = document.getElementById('lancelot-variant'); // 蘭斯洛特變體選擇的容器
    const lancelotOptions = document.querySelectorAll('.lancelot-option'); // 蘭斯洛特變體選項
    const voiceRateSlider = document.getElementById('voice-rate'); 
    const rateDisplay = document.getElementById('rate-display');

    let selectedCharacters = [];
    let lancelotVariant = "12"; // 預設為變體1/2
    let utterance; 
    let isPaused = false;
    let isPlaying = false; 
    let voiceRate = 1.0; 
const viewSkillsButton = document.getElementById("view-skills-button");

    // 點擊按鈕時跳轉到新的角色技能頁面
    viewSkillsButton.addEventListener("click", () => {
        window.location.href = "skills.html"; // 跳轉到skills.html
    });
    const merlin = document.querySelector('.character[data-name="梅林"]');
    const assassin = document.querySelector('.character[data-name="刺客"]'); 
    const goodLancelot = document.querySelector('.character[data-name="正義蘭斯洛特"]');
    const evilLancelot = document.querySelector('.character[data-name="邪惡蘭斯洛特"]');
const recommendedCombinations = {
        5: ["梅林", "派西維爾", "莫甘娜", "刺客"], // +1 忠臣
        6: ["梅林", "派西維爾", "莫甘娜", "刺客"], // +2 忠臣
        7: ["梅林", "派西維爾", "莫甘娜", "刺客", "奧伯倫"], // +2 忠臣
        8: ["梅林", "派西維爾", "莫甘娜", "刺客"], // +3 忠臣, +1 爪牙
        9: ["梅林", "派西維爾", "莫甘娜", "刺客", "莫德雷德"], // +4 忠臣
        10: ["梅林", "派西維爾", "莫甘娜", "刺客", "奧伯倫", "莫德雷德"] // +4 忠臣
    };

    // 忠臣、爪牙数量提示
    const loyalServantCounts = {
        5: 1,
        6: 2,
        7: 2,
        8: 3,
        9: 4,
        10: 4
    };

    const minionCounts = {
        5: 0,
        6: 0,
        7: 0,
        8: 1,
        9: 1,
        10: 1
    };

    // 處理推薦角色按鈕的點擊事件
    const recommendButtons = document.querySelectorAll('.recommend-button');
    const recommendationInfo = document.getElementById('recommendation-info');

    recommendButtons.forEach(button => {
        button.addEventListener('click', () => {
            const playerCount = parseInt(button.dataset.players);

            // 獲取推薦的角色組合
            const recommendedCharacters = recommendedCombinations[playerCount];

            // 清除所有已選擇的角色
            characters.forEach(character => character.classList.remove('selected'));
            selectedCharacters = [];

            // 遍歷推薦角色並將其選中
            recommendedCharacters.forEach(name => {
                const characterElement = document.querySelector(`.character[data-name="${name}"]`);
                if (characterElement) {
                    characterElement.classList.add('selected');
                    selectedCharacters.push(name);
                }
            });

            // 如果包含蘭斯洛特角色，顯示變體選擇
            if (recommendedCharacters.includes("正義蘭斯洛特") || recommendedCharacters.includes("邪惡蘭斯洛特")) {
                goodLancelot.classList.add('selected');
                evilLancelot.classList.add('selected');
                lancelotVariantSection.style.display = 'flex';
            } else {
                lancelotVariantSection.style.display = 'none';
            }

            // 處理按鈕樣式：移除其他按鈕的選中狀態，並設置當前按鈕為選中狀態
            recommendButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            // 顯示忠臣、爪牙和湖中女神的提示信息
            const loyalServants = loyalServantCounts[playerCount];
            const minions = minionCounts[playerCount];
            let infoText = `忠臣: ${loyalServants} 人${minions > 0 ? `，爪牙: ${minions} 人` : ''}`;
            if (playerCount >= 7) {
                infoText += `，湖中女神`;
            }

            recommendationInfo.innerHTML = infoText;
            recommendationInfo.classList.remove('hidden');
        });
    });

    // 監聽每個角色的點擊事件，當手動選擇角色時，取消推薦按鈕的選中狀態
    characters.forEach(character => {
        character.addEventListener('click', () => {
            recommendButtons.forEach(btn => btn.classList.remove('selected'));
            recommendationInfo.classList.add('hidden'); // 隱藏忠臣、爪牙和湖中女神提示信息
        });
    });

    // 預設選擇梅林和刺客
    merlin.classList.add('selected');
    assassin.classList.add('selected');
    selectedCharacters.push('梅林', '刺客');

    // 處理角色選擇
    characters.forEach(character => {
        character.addEventListener('click', () => {
            if (character.dataset.name === '梅林' || character.dataset.name === '刺客') return;

            if (character.classList.contains('selected')) {
                // 取消選擇角色
                character.classList.remove('selected');
                selectedCharacters = selectedCharacters.filter(name => name !== character.dataset.name);

                // 如果取消的是正義或邪惡蘭斯洛特，也需要取消另一個
                if (character.dataset.name === '正義蘭斯洛特' || character.dataset.name === '邪惡蘭斯洛特') {
                    goodLancelot.classList.remove('selected');
                    evilLancelot.classList.remove('selected');
                    selectedCharacters = selectedCharacters.filter(name => name !== '正義蘭斯洛特' && name !== '邪惡蘭斯洛特');
                    lancelotVariantSection.style.display = 'none';
                }
            } else {
                // 選擇角色
                character.classList.add('selected');
                selectedCharacters.push(character.dataset.name);

                // 如果選擇的是正義或邪惡蘭斯洛特，確保兩個同時被選中
                if (character.dataset.name === '正義蘭斯洛特' || character.dataset.name === '邪惡蘭斯洛特') {
                    goodLancelot.classList.add('selected');
                    evilLancelot.classList.add('selected');
                    if (!selectedCharacters.includes('正義蘭斯洛特')) selectedCharacters.push('正義蘭斯洛特');
                    if (!selectedCharacters.includes('邪惡蘭斯洛特')) selectedCharacters.push('邪惡蘭斯洛特');
                    lancelotVariantSection.style.display = 'flex'; // 顯示蘭斯洛特變體選擇
                }
            }
        });
    });

    // 設置蘭斯洛特變體選擇的UI
    lancelotOptions.forEach(option => {
        option.addEventListener('click', () => {
            lancelotOptions.forEach(opt => opt.classList.remove('selected')); // 移除其他選項的選中狀態
            option.classList.add('selected'); // 添加當前選項的選中狀態
            lancelotVariant = option.dataset.value; // 更新選中的蘭斯洛特變體值
        });
    });

    // 初始設置默認選項為變體1/2
    document.querySelector('.lancelot-option[data-value="12"]').classList.add('selected');


    const updateGuideText = () => {
        guideText.innerHTML = ''; 

        let guideContent = "";
        guideContent += `<p>請所有人閉上眼睛</p>`;
        guideContent += `<p>單手握拳放在面前</p>`;

        if (selectedCharacters.includes('奧伯倫')) {
            guideContent += `除了奧伯倫以外的壞人舉起大拇指<br>`;
        } else {
            guideContent += `所有壞人舉起大拇指<br>`;
        }

        if ((lancelotVariant === "12" || lancelotVariant === "3") && selectedCharacters.includes('邪惡蘭斯洛特')) {
            guideContent += `除了邪惡蘭斯洛特以外的壞人睜開眼睛確認隊友<br>`;
        } else {
            guideContent += `所有壞人睜開眼睛確認隊友<br>`;
        }

        guideContent += `5、4、3、2、1！<br>`;
        guideContent += `所有壞人閉上眼睛<br>`;
        guideContent += `拇指繼續舉著<br>`;

        if (selectedCharacters.includes('莫德雷德')) {
            guideContent += `莫德雷德放下大拇指<br>`;
        }

        if (selectedCharacters.includes('奧伯倫')) {
            guideContent += `奧伯倫請舉起大拇指<br>`;
        }

        guideContent += `梅林請睜開眼睛確認壞人<br>`;
        guideContent += `5、4、3、2、1！<br>`;
        guideContent += `梅林閉上眼睛<br>`;
        guideContent += `所有壞人放下大拇指<br>`;

        if (selectedCharacters.includes('派西維爾')) {
            if (selectedCharacters.includes('莫甘娜')) {
                guideContent += `梅林與莫甘娜舉起大拇指<br>`; 
                guideContent += `派西維爾請睜開眼睛確認兩人<br>`;
            } else {
                guideContent += `梅林舉起大拇指<br>`;
                guideContent += `派西維爾請睜開眼睛確認梅林<br>`;
            }
            guideContent += `5、4、3、2、1！<br>`; 
            guideContent += `派西維爾閉上眼睛<br>`;

            if (selectedCharacters.includes('莫甘娜')) {
                guideContent += `梅林與莫甘娜放下大拇指<br>`; 
            } else {
                guideContent += `梅林放下大拇指<br>`;
            }
        }

        if (lancelotVariant === "3" && selectedCharacters.includes('正義蘭斯洛特') && selectedCharacters.includes('邪惡蘭斯洛特')) {
            guideContent += `正義蘭斯洛特與邪惡蘭斯洛特請睜開眼睛確認彼此<br>`;
            guideContent += `5、4、3、2、1！<br>`;
            guideContent += `兩位蘭斯洛特閉上眼睛<br>`;
        }

        guideContent += `遊戲開始<br>`;

        guideContent = guideContent
            .replace(/梅林/g, '<span class="highlight-blue">梅林</span>')
            .replace(/派西維爾/g, '<span class="highlight-blue">派西維爾</span>')
            .replace(/壞人/g, '<span class="highlight-red">壞人</span>')
            .replace(/莫德雷德|莫甘娜|奧伯倫|刺客|邪惡/g, '<span class="highlight-red">$&</span>')
            .replace(/正義/g, '<span class="highlight-blue">$&</span>')
            .replace(/蘭斯洛特/g, '<span class="highlight-purple">$&</span>');

        guideText.innerHTML = guideContent;
    };


    // 語音播放/暫停功能
    const togglePlayPause = () => {
        if (isPlaying) {
            window.speechSynthesis.pause();
            playPauseButton.textContent = "播放";
            isPaused = true;
            isPlaying = false;
        } else {
            if (isPaused) {
                window.speechSynthesis.resume();
            } else {
                const guideTextContent = guideText.innerText.split('\n');
                speakGuideContent(guideTextContent);
            }
            playPauseButton.textContent = "暫停";
            isPaused = false;
            isPlaying = true;
        }
    };

    const speakGuideContent = (contentArray) => {
        if (contentArray.length === 0) {
            isPlaying = false;
            playPauseButton.textContent = "播放";
            return;
        }

        const currentText = contentArray.shift();
        utterance = new SpeechSynthesisUtterance(currentText);
        utterance.rate = currentText.trim().match(/^5、4、3、2、1！$/) ? 0.2 : voiceRate;
        utterance.onend = () => speakGuideContent(contentArray);

        window.speechSynthesis.speak(utterance);
    };

    const stopVoice = () => {
        if (window.speechSynthesis.speaking || isPaused) {
            window.speechSynthesis.cancel();
            playPauseButton.textContent = "播放";
            isPaused = false;
            isPlaying = false;
        }
    };

    voiceRateSlider.addEventListener('input', (event) => {
        voiceRate = parseFloat(event.target.value);
        rateDisplay.textContent = voiceRate.toFixed(1);
    });

    playPauseButton.addEventListener('click', togglePlayPause);
    stopVoiceButton.addEventListener('click', stopVoice);

    backButton.addEventListener('click', () => {
        gameGuide.classList.add('hidden');
        characterSelection.classList.remove('hidden');
        stopVoice();
    });

    confirmButton.addEventListener('click', () => {
        if (selectedCharacters.length > 0) {
            characterSelection.classList.add('hidden');
            gameGuide.classList.remove('hidden');
            updateGuideText();
        } else {
            alert("請至少選擇一個角色！");
        }
    });
});


