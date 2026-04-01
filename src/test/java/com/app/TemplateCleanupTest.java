package com.app;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

class TemplateCleanupTest {

    @Test
    void loginAndSignupStandaloneTemplatesAreRemovedWhileModalAssetsStayReferenced() throws IOException {
        assertFalse(resourceExists("templates/main/login.html"));
        assertFalse(resourceExists("templates/main/sign-up.html"));

        String mainTemplate = readResource("templates/main/main.html");
        String introTemplate = readResource("templates/main/intro-main.html");

        assertTrue(mainTemplate.contains("../../static/css/main/auth-modal.css"));
        assertTrue(mainTemplate.contains("../../static/css/main/signup-modal.css"));
        assertTrue(mainTemplate.contains("../../static/js/main/auth-modal.js"));
        assertTrue(mainTemplate.contains("../../static/js/main/signup-modal.js"));

        assertTrue(introTemplate.contains("../../static/css/main/auth-modal.css"));
        assertTrue(introTemplate.contains("../../static/css/main/signup-modal.css"));
        assertTrue(introTemplate.contains("../../static/js/main/auth-modal.js"));
        assertTrue(introTemplate.contains("../../static/js/main/signup-modal.js"));
    }

    @Test
    void introMainUsesPageScopedVanillaScriptContract() throws IOException {
        String introTemplate = readResource("templates/main/intro-main.html");
        String introScript = readResource("static/js/main/intro-main.js");

        assertTrue(introTemplate.contains("data-intro-main-root"));
        assertTrue(introTemplate.contains("../../static/js/main/intro-main.js"));

        assertTrue(introScript.contains("DOMContentLoaded"));
        assertTrue(introScript.contains("data-intro-main-root"));
        assertFalse(introScript.contains("lit-html"));
        assertFalse(introScript.contains("LBHeader"));
        assertFalse(introScript.contains("YTCCreatorSpotlight"));
    }

    @Test
    void introMainSnapshotIsFullyPopulatedAndUsesLocalCreatorMedia() throws IOException {
        String introTemplate = readResource("templates/main/intro-main.html");
        String layoutTemplate = readResource("templates/layout/youtube-shell.html");
        String introStyles = readResource("static/css/main/intro-main.css");

        assertTrue(layoutTemplate.contains("홈"));
        assertTrue(layoutTemplate.contains("Shorts"));
        assertTrue(layoutTemplate.contains("시청 기록"));
        assertTrue(layoutTemplate.contains("../../static/images/logo.png"));

        assertFalse(introTemplate.contains("[일러스트]"));
        assertFalse(introTemplate.contains("[아이콘]"));
        assertFalse(introTemplate.contains("[학습 아이콘]"));
        assertFalse(introTemplate.contains("[지원 아이콘]"));
        assertFalse(introTemplate.contains("[연결 아이콘]"));
        assertFalse(introTemplate.contains("/creators/static/images/"));
        assertFalse(introTemplate.contains("<video class=\"ytc-home-hero__video\"></video>"));

        assertFalse(introStyles.contains("/creators/static/images/"));
    }

    @Test
    void youtubeShellLayoutIsExtractedAndIntroMainConsumesLocalShellAssets() throws IOException {
        String layoutTemplate = readResource("templates/layout/youtube-shell.html");
        String introTemplate = readResource("templates/main/intro-main.html");
        String shellStyles = readResource("static/css/layout/youtube-shell-overrides.css");
        String shellScript = readResource("static/js/layout/youtube-shell-bridge.js");

        assertTrue(layoutTemplate.contains("th:fragment=\"ytShellHead(pageTitle)\""));
        assertTrue(layoutTemplate.contains("th:fragment=\"ytShellChrome(activeItemKey)\""));
        assertTrue(layoutTemplate.contains("th:fragment=\"ytShellScripts()\""));
        assertTrue(layoutTemplate.contains("../../static/vendor/youtube-shell/20260331/css/www-onepick.css"));
        assertTrue(layoutTemplate.contains("../../static/vendor/youtube-shell/20260331/js/webcomponents-sd.js"));
        assertTrue(layoutTemplate.contains("../../static/css/layout/youtube-shell-overrides.css"));
        assertTrue(layoutTemplate.contains("../../static/js/layout/youtube-shell-bridge.js"));
        assertTrue(layoutTemplate.contains("../../static/images/logo.png"));
        assertFalse(layoutTemplate.contains("https://www.youtube.com/s/desktop/"));
        assertFalse(layoutTemplate.contains("https://www.youtube.com/s/_/ytmainappweb/"));

        assertTrue(introTemplate.contains("templates/layout/youtube-shell :: ytShellHead"));
        assertTrue(introTemplate.contains("templates/layout/youtube-shell :: ytShellChrome"));
        assertTrue(introTemplate.contains("templates/layout/youtube-shell :: ytShellScripts"));
        assertTrue(introTemplate.contains("data-intro-main-root"));

        assertTrue(shellStyles.contains(".yt-shell"));
        assertTrue(shellStyles.contains(".yt-shell__guide"));
        assertTrue(shellScript.contains("data-yt-shell-root"));
        assertTrue(shellScript.contains("data-yt-shell-menu-toggle"));
    }

    @Test
    void mainTemplateUsesOnlyStandardHtmlTagsForMoviesScreen() throws IOException {
        String mainTemplate = readResource("templates/main/main.html");
        String mainStyles = readResource("static/css/main/main-standardized.css");
        String mainScript = readResource("static/js/main/main-standardized.js");

        assertTrue(mainTemplate.contains("templates/layout/youtube-shell :: ytShellHead"));
        assertTrue(mainTemplate.contains("templates/layout/youtube-shell :: ytShellChrome"));
        assertTrue(mainTemplate.contains("templates/layout/youtube-shell :: ytShellScripts"));
        assertTrue(mainTemplate.contains("../../static/css/main/main-standardized.css"));
        assertTrue(mainTemplate.contains("../../static/js/main/main-standardized.js"));
        assertTrue(mainTemplate.contains("data-main-root"));
        assertTrue(mainTemplate.contains("영화 및 프로그램"));
        assertTrue(mainTemplate.contains("나를 위한 Primetime 영화 추천"));
        assertTrue(mainTemplate.contains("최신작"));
        assertTrue(mainTemplate.contains("명작"));
        assertTrue(mainTemplate.contains("아바타: 불과 재"));
        assertTrue(mainTemplate.contains("F1 (F1 The Movie)"));
        assertTrue(mainTemplate.contains("하늘의 푸르름을 아는 사람이여"));

        assertFalse(mainTemplate.matches("(?s).*</?(?:ytd|yt|tp-yt|iron|paper|dom|badge-shape|custom-style|.*-view-model)[a-z0-9:_-]*\\b.*"));

        assertTrue(mainStyles.contains(".movies-page"));
        assertTrue(mainStyles.contains(".movies-shelf__track"));
        assertTrue(mainScript.contains("data-main-shelf"));
        assertTrue(mainScript.contains("data-main-chip"));
    }

    private boolean resourceExists(String path) {
        return new ClassPathResource(path).exists();
    }

    private String readResource(String path) throws IOException {
        ClassPathResource resource = new ClassPathResource(path);
        assertNotNull(resource);
        try (InputStream stream = resource.getInputStream()) {
            return new String(stream.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
}
