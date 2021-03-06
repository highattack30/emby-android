﻿define(['appStorage', 'shell'], function (appStorage, shell) {

    var supporterPlaybackKey = 'lastSupporterPlaybackMessage4';

    function validatePlayback(resolve, reject) {

        Dashboard.getPluginSecurityInfo().then(function (pluginSecurityInfo) {

            if (pluginSecurityInfo.IsMBSupporter) {
                resolve();
            } else {

                var lastMessage = parseInt(appStorage.getItem(supporterPlaybackKey) || '0');

                if (!lastMessage) {

                    // Don't show on the very first playback attempt
                    appStorage.setItem(supporterPlaybackKey, new Date().getTime());
                    resolve();
                }
                else if ((new Date().getTime() - lastMessage) > 259200000) {

                    showPlaybackOverlay(resolve, reject);
                } else {
                    resolve();
                }
            }
        });
    }

    function getSubscriptionBenefits() {

        var list = [];

        list.push({
            name: Globalize.translate('CoverArt'),
            icon: 'photo',
            text: Globalize.translate('CoverArtFeatureDescription')
        });

        list.push({
            name: Globalize.translate('HeaderFreeApps'),
            icon: 'check',
            text: Globalize.translate('FreeAppsFeatureDescription')
        });

        if (Dashboard.capabilities().SupportsSync) {
            list.push({
                name: Globalize.translate('HeaderMobileSync'),
                icon: 'sync',
                text: Globalize.translate('MobileSyncFeatureDescription')
            });
        }
        else {
            list.push({
                name: Globalize.translate('HeaderCinemaMode'),
                icon: 'movie',
                text: Globalize.translate('CinemaModeFeatureDescription')
            });
        }

        return list;
    }

    function getSubscriptionBenefitHtml(item) {

        var html = '';
        html += '<div class="listItem">';

        html += '<i class="listItemIcon md-icon">' + item.icon + '</i>';

        html += '<div class="listItemBody two-line">';
        html += '<a class="clearLink" href="https://emby.media/premiere" target="_blank">';

        html += '<h3 class="listItemBodyText">';
        html += item.name;
        html += '</h3>';

        html += '<div class="listItemBodyText secondary" style="white-space:normal;">';
        html += item.text;
        html += '</div>';

        html += '</a>';
        html += '</div>';

        html += '</div>';

        return html;
    }

    function showPlaybackOverlay(resolve, reject) {

        require(['dialogHelper', 'listViewStyle', 'emby-button', 'formDialogStyle'], function (dialogHelper) {

            var dlg = dialogHelper.createDialog({
                size: 'fullscreen-border',
                removeOnClose: true,
                scrollY: false
            });

            dlg.classList.add('formDialog');

            var html = '';
            html += '<div class="formDialogHeader">';
            html += '<button is="paper-icon-button-light" class="btnCancel autoSize" tabindex="-1"><i class="md-icon">&#xE5C4;</i></button>';
            html += '<h3 class="formDialogHeaderTitle">';
            html += '</h3>';

            html += '</div>';


            html += '<div class="formDialogContent smoothScrollY">';
            html += '<div class="dialogContentInner dialog-content-centered">';

            html += '<h1>' + Globalize.translate('HeaderTryEmbyPremiere') + '</h1>';

            html += '<p>' + Globalize.translate('MessageDidYouKnowCinemaMode') + '</p>';
            html += '<p>' + Globalize.translate('MessageDidYouKnowCinemaMode2') + '</p>';

            html += '<br/>';

            html += '<h1>' + Globalize.translate('HeaderBenefitsEmbyPremiere') + '</h1>';

            html += '<div class="paperList">';
            html += getSubscriptionBenefits().map(getSubscriptionBenefitHtml).join('');
            html += '</div>';

            html += '<br/>';

            html += '<a class="clearLink" href="http://emby.media/premiere" target="_blank"><button is="emby-button" type="button" class="raised button-submit block" autoFocus><span>' + Globalize.translate('ButtonBecomeSupporter') + '</span></button></a>';
            html += '<button is="emby-button" type="button" class="raised subdued block btnCancelSupporterInfo" style="background:#444;"><span>' + Globalize.translate('ButtonClosePlayVideo') + '</span></button>';

            html += '</div>';
            html += '</div>';

            dlg.innerHTML = html;

            // Has to be assigned a z-index after the call to .open() 
            dlg.addEventListener('close', function (e) {
                appStorage.setItem(supporterPlaybackKey, new Date().getTime());
                resolve();
            });

            dialogHelper.open(dlg);

            var onCancelClick = function () {
                dialogHelper.close(dlg);
            };
            var i, length;
            var elems = dlg.querySelectorAll('.btnCancelSupporterInfo');
            for (i = 0, length = elems.length; i < length; i++) {
                elems[i].addEventListener('click', onCancelClick);
            }
        });
    }

    function validateSync(resolve, reject) {

        Dashboard.getPluginSecurityInfo().then(function (pluginSecurityInfo) {

            if (pluginSecurityInfo.IsMBSupporter) {
                resolve();
                return;
            }

            Dashboard.showLoadingMsg();

            ApiClient.getRegistrationInfo('Sync').then(function (registrationInfo) {

                Dashboard.hideLoadingMsg();

                if (registrationInfo.IsRegistered) {
                    resolve();
                    return;
                }

                Dashboard.alert({
                    message: Globalize.translate('HeaderSyncRequiresSupporterMembership') + '<br/><p><a href="http://emby.media/premiere" target="_blank">' + Globalize.translate('ButtonLearnMore') + '</a></p>',
                    title: Globalize.translate('HeaderSync'),
                    callback: reject
                });

            }, function () {

                reject();
                Dashboard.hideLoadingMsg();

                Dashboard.alert({
                    message: Globalize.translate('ErrorValidatingSupporterInfo')
                });
            });

        });
    }

    return {
        validateFeature: function (name) {

            return new Promise(function (resolve, reject) {
                if (name == 'playback') {
                    validatePlayback(resolve, reject);
                } else if (name == 'livetv') {
                    resolve();
                } else if (name == 'sync') {
                    validateSync(resolve, reject);
                } else {
                    resolve();
                }
            });
        },

        showPremiereInfo: function () {
            shell.openUrl('https://emby.media/premiere');
        }
    };
});