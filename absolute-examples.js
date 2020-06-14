exports.examples = {
  1: {
    id: 1,
    code: [
        'public class ResourceCreateHandler {\n' +
        '    private final MetadataAdjuster metadataAdjuster;\n' +
        '\n' +
        '    public ResourceContents adjustContents(ResourceContents contents) {\n' +
        '        contents.getContents.stream()\n' +
        '                .map(content -> {\n' +
        '                    if (content.getMetadata().getControl() == MetadataControl.DOUBLE) {\n' +
        '                        adjustDoubleMetadataValue(content.getValue(), content.getMetadata());\n' +
        '                    } else if (content.getMetadata().getControl() == MetadataControl.DATE) {\n' +
        '                        adjustDateMetadataValue(content.getValue(), content.getMetadata());\n' +
        '                    } else if (content.getMetadata().getControl() == MetadataControl.FILE) {\n' +
        '                        adjustFileMetadataValue(content.getValue(), content.getMetadata());\n' +
        '                    } else if (content.getMetadata().getControl() == MetadataControl.RELATIONSHIP) {\n' +
        '                        adjustRelationshipMetadataValue(content.getValue(), content.getMetadata());\n' +
        '                    }\n' +
        '                });\n' +
        '        return contents;\n' +
        '    }\n' +
        '\n' +
        '    private MetadataValue adjustDateMetadataValue(MetadataValue value, Metadata metadata) {\n' +
        '        if (value.getVaulue() == null) {\n' +
        '            return null;\n' +
        '        }\n' +
        '        MetadataValue result = MetadataDateControlConverterUtil.convertDateToFlexibleDate(\n' +
        '                value.getVaulue().getFrom(),\n' +
        '                value.getVaulue().getTo(),\n' +
        '                value.getVaulue().getMode(),\n' +
        '                value.getVaulue().getRangeMode()\n' +
        '        );\n' +
        '        return value.withNewValue(result);\n' +
        '    }\n' +
        '\n' +
        '    private MetadataValue adjustDoubleMetadataValue(MetadataValue value, Metadata metadata) {\n' +
        '        String textValue = value.getValue().replace(",", ".").trim();\n' +
        '        Float floatValue = Float.valueOf(textValue);\n' +
        '        return value.withNewValue(floatValue);\n' +
        '    }\n' +
        '\n' +
        '    private MetadataValue adjustFileMetadataValue(MetadataValue value, Metadata metadata) {\n' +
        '        String path = URLDecoder.decode(value.getValue(), "UTF-8");\n' +
        '        return value.withNewValue(path);\n' +
        '    }\n' +
        '\n' +
        '    private MetadataValue adjustRelationshipMetadataValue(MetadataValue value, Metadata metadata) {\n' +
        '        int result = value.getValue() instanceof ResourceEntity\n' +
        '                ? value.getValue().getId()\n' +
        '                : Integer.valueOf(value.getValue());\n' +
        '        return value.withNewValue(result);\n' +
        '    }\n' +
        '}'
    ]
  },
  2: {
    id: 2,
    code: [
        'public class TweetRepositoryService {\n' +
        '    private final TweetRepository tweetRepository;\n' +
        '    private final UserProfileRepositoryService userService;\n' +
        '\n' +
        '    private void checkIfSavedAndSave(TweetEntity tweetToSave, String tag) {\n' +
        '        TweetEntity savedTweet = tweetRepository.findTweetEntityByVendorId(tweetToSave.getVendorId());\n' +
        '        if (savedTweet != null && savedTweet.getText() != null) {\n' +
        '            addTagAndSave(savedTweet, tag);\n' +
        '        } else if(savedTweet != null) {\n' +
        '            overwriteEmptyNode(savedTweet, tweetToSave, tag);\n' +
        '        } else {\n' +
        '            addTagAndSave(tweetToSave, tag);\n' +
        '        }\n' +
        '    }\n' +
        '\n' +
        '    private void addTagAndSave(TweetEntity tweet, String tag) {\n' +
        '        Set<String> storedTags = tweet.getTags();\n' +
        '        storedTags.add(tag);\n' +
        '        tweet.setTags(storedTags);\n' +
        '        tweetRepository.save(tweet);\n' +
        '    }\n' +
        '\n' +
        '    private void overwriteEmptyNode(TweetEntity emptyNode, TweetEntity tweetToSave, String tag) {\n' +
        '        tweetToSave.setId(emptyNode.getId());\n' +
        '        addTagAndSave(tweetToSave, tag);\n' +
        '    }\n' +
        '\n' +
        '    private TweetEntity getTweetEntity(Long vendorId) {\n' +
        '        if (vendorId == null) {\n' +
        '            return null;\n' +
        '        }\n' +
        '        TweetEntity tweetEntity = tweetRepository.findTweetEntityByVendorId(vendorId);\n' +
        '        if (tweetEntity == null) {\n' +
        '            tweetEntity = TweetEntity.builder()\n' +
        '                    .vendorId(vendorId)\n' +
        '                    .build();\n' +
        '            tweetRepository.save(tweetEntity);\n' +
        '        }\n' +
        '        return tweetEntity;\n' +
        '    }\n' +
        '}'
    ]
  },
  3: {
    id: 3,
    code: [
        'public class TwitterDataFetcher extends SocialMediaDataFetcher<TweetEntity, Twitter> {\n' +
        '    private final TwitterProperties twitterProperties;\n' +
        '    private final SdasProperties sdasProperties;\n' +
        '    private final TweetRepository tweetRepository;\n' +
        '    private final TweetRepositoryService tweetRepositoryService;\n' +
        '\n' +
        '    public void fetchData() {\n' +
        '        for (String tag : sdasProperties.getTags()) {\n' +
        '            SearchParameters searchParameters = new SearchParameters(tag);\n' +
        '            searchParameters.count(100);\n' +
        '            searchParameters.sinceId(setSinceId(tag));\n' +
        '            Twitter twitterTemplate = getProviderTemplate();\n' +
        '            SearchResults searchResults;\n' +
        '            do {\n' +
        '                searchResults = twitterTemplate.searchOperations().search(searchParameters);\n' +
        '                tweetRepositoryService.storeTweets(searchResults.getTweets(), tag);\n' +
        '                TweetEntity lastTweet = getLastSocialDataEntityByTag(tag);\n' +
        '                if (lastTweet != null) {\n' +
        '                    searchParameters.sinceId(lastTweet.getVendorId());\n' +
        '                }\n' +
        '            } while (searchResults.getTweets().size() != 0);\n' +
        '        }\n' +
        '    }\n' +
        '\n' +
        '    private long setSinceId(String tag) {\n' +
        '        TweetEntity lastTweet = getLastSocialDataEntityByTag(tag);\n' +
        '        long lastRunTweetId;\n' +
        '        if (lastTweet != null) {\n' +
        '            lastRunTweetId = lastTweet.getVendorId();\n' +
        '        } else {\n' +
        '            lastRunTweetId = 1;\n' +
        '        }\n' +
        '        return lastRunTweetId;\n' +
        '    }\n' +
        '\n' +
        '    protected Twitter getProviderTemplate() {\n' +
        '        String consumerKey = twitterProperties.getConsumerKey();\n' +
        '        String consumerSecret = twitterProperties.getConsumerSecret();\n' +
        '        String accessToken = twitterProperties.getAccessToken();\n' +
        '        String accessTokenSecret = twitterProperties.getAccessTokenSecret();\n' +
        '\n' +
        '        return new TwitterTemplate(consumerKey, consumerSecret, accessToken, accessTokenSecret);\n' +
        '    }\n' +
        '}'
    ]
  },
  4: {
    id: 4,
    code: [
        'public class Main extends AbstractVerticle {\n' +
        '\n' +
        '    @Override\n' +
        '    public void start() throws Exception {\n' +
        '\n' +
        '        Router router = Router.router(vertx);\n' +
        '        HttpClient client = vertx.createHttpClient();\n' +
        '\n' +
        '        router.route("/vertx/main/:yr/:mt/:dy").handler(routingContext -> {\n' +
        '            String year = routingContext.request().getParam("yr");\n' +
        '            String month = routingContext.request().getParam("mt");\n' +
        '            String day = routingContext.request().getParam("dy");\n' +
        '\n' +
        '            client.getNow(8080, "localhost", "/cw-netkernel/nasa/" + year + "/" + month + "/" + day,\n' +
        '                    response -> {\n' +
        '                        response.bodyHandler(buffer -> {\n' +
        '                            String result = buffer.toString(); // odpowiedź z mikroserwisu\n' +
        '                            String nasaMappedString = meinLiebeMethod(client, result, 0, new StringBuilder()).toString();\n' +
        '                            routingContext\n' +
        '                                    .response()\n' +
        '                                    .putHeader("content-type", "text/html")\n' +
        '                                    .end(nasaMappedString);\n' +
        '                        });\n' +
        '                    });\n' +
        '        });\n' +
        '        vertx.createHttpServer().requestHandler(router::accept).listen(8081);\n' +
        '    }\n' +
        '\n' +
        '    private StringBuilder meinLiebeMethod(HttpClient client, String input, int index, StringBuilder result) {\n' +
        '        int[] ints = LoaderAnalyzer.findNextPN(input, index);\n' +
        '\n' +
        '        if (ints[1] == -10) {\n' +
        '            result.append(input.substring(index));\n' +
        '            System.out.println(result);\n' +
        '            return result;\n' +
        '        }\n' +
        '\n' +
        '        String query = input.substring(ints[0], ints[1]).replace(" ", "_");\n' +
        '        client.getNow(8080, "localhost", "/cw-netkernel/wikimedia/" + query,\n' +
        '                wikiResponse -> {\n' +
        '                    wikiResponse.bodyHandler(wikiBuffer -> {\n' +
        '                        String wikiLink = wikiBuffer.toString().replace(" ", "_");\n' +
        '                        result.append(input, index, ints[0]);\n' +
        '                        result.append("<a href=\\"")\n' +
        '                                .append(wikiLink)\n' +
        '                                .append("\\">")\n' +
        '                                .append(query)\n' +
        '                                .append("</a>");\n' +
        '                        meinLiebeMethod(client, input, ints[1], result);\n' +
        '                        System.out.println(result);\n' +
        '                    });\n' +
        '                });\n' +
        '        return result;\n' +
        '    }\n' +
        '}'
    ]
  },
  5: {
    id: 5,
    code: [
        'public class CaptchaService {\n' +
        '    private static final Pattern RESPONSE_PATTERN = Pattern.compile("[A-Za-z0-9_-]+");\n' +
        '    private final CaptchaSettings captchaSettings;\n' +
        '    private final RestTemplate restTemplate;\n' +
        '\n' +
        '    public void processResponse(String response, String remoteAddress)\n' +
        '            throws URISyntaxException, InvalidReCaptchaException {\n' +
        '        if (!responseSanityCheck(response)) {\n' +
        '            throw new InvalidReCaptchaException("ReCaptcha response contains invalid characters");\n' +
        '        }\n' +
        '        URI verifyUri = generateVerifyUri(response, remoteAddress);\n' +
        '        GoogleReCaptchaResponse googleResponse = restTemplate.getForObject(verifyUri, GoogleReCaptchaResponse.class);\n' +
        '        if (!googleResponse.isSuccess()) {\n' +
        '            throw new InvalidReCaptchaException("ReCaptcha was not successfully validated");\n' +
        '        }\n' +
        '    }\n' +
        '\n' +
        '    private boolean responseSanityCheck(String response) {\n' +
        '        return StringUtils.hasLength(response) && RESPONSE_PATTERN.matcher(response).matches();\n' +
        '    }\n' +
        '\n' +
        '    private URI generateVerifyUri(String response, String remoteAddress) throws URISyntaxException {\n' +
        '        URIBuilder builder = new URIBuilder(captchaSettings.getVerificationUrl());\n' +
        '        builder\n' +
        '                .addParameter("secret", captchaSettings.getSecret())\n' +
        '                .addParameter("response", response)\n' +
        '                .addParameter("remoteip", remoteAddress);\n' +
        '        return builder.build();\n' +
        '    }\n' +
        '}'
    ]
  },
  6: {
    id: 6,
    code: [
        'public class FixturesManagementService {\n' +
        '\n' +
        '    private final MenuRepository menuRepository;\n' +
        '    private final RatesRepository ratesRepository;\n' +
        '    private final UsersRepository usersRepository;\n' +
        '    private final PlacesRepository placesRepository;\n' +
        '    private final UserRepositoryService userRepositoryService;\n' +
        '\n' +
        '    private final MenuFixtureProperties menuFixtureProperties;\n' +
        '    private final RatesFixtureProperties ratesFixtureProperties;\n' +
        '    private final UsersFixtureProperties usersFixtureProperties;\n' +
        '    private final PlacesFixtureProperties placesFixtureProperties;\n' +
        '\n' +
        '\n' +
        '    private static final Logger LOGGER = LoggerFactory.getLogger(FixturesManagementService.class);\n' +
        '\n' +
        '    @EventListener(ContextRefreshedEvent.class)\n' +
        '    protected void replaceFixturesAfterStartUp() {\n' +
        '        if (menuFixtureProperties.getEnabled() && menuFixtureProperties.getDeleteExisting()) {\n' +
        '            LOGGER.info("All menu items will be deleted from DB and replaced with fixtures.");\n' +
        '            menuRepository.deleteAll();\n' +
        '            saveMenuEntities();\n' +
        '        }\n' +
        '        if (usersFixtureProperties.getEnabled()) {\n' +
        '            LOGGER.info("All users from fixtures will be loaded to database if not exist");\n' +
        '            saveUsersEntities();\n' +
        '            if (usersFixtureProperties.getDeleteExisting()) {\n' +
        '                createFriendsConnections();\n' +
        '            }\n' +
        '        }\n' +
        '        if (placesFixtureProperties.getEnabled()) {\n' +
        '            if (placesFixtureProperties.getDeleteExisting()) {\n' +
        '                LOGGER.info("All places will be deleted from DB and replaced with fixtures");\n' +
        '                placesRepository.deleteAll();\n' +
        '            }\n' +
        '            placesRepository.save(placesFixtureProperties.getPlaces());\n' +
        '        }\n' +
        '        if (ratesFixtureProperties.getEnabled()) {\n' +
        '            if (ratesFixtureProperties.getDeleteExisting()) {\n' +
        '                ratesRepository.deleteAll();\n' +
        '            }\n' +
        '            LOGGER.info("All users will receive rates for places given in fixtures. If lack of places, they will be created.");\n' +
        '            saveRatesEntities(RateStatus.RATED);\n' +
        '            saveRatesEntities(RateStatus.LAST_VISIT_NOT_RATED);\n' +
        '        }\n' +
        '    }\n' +
        '\n' +
        '    protected void saveMenuEntities() {\n' +
        '        Arrays.stream(PlaceType.values())\n' +
        '                .map(this::createMenuEntity)\n' +
        '                .forEach(menuRepository::save);\n' +
        '    }\n' +
        '\n' +
        '    protected MenuEntity createMenuEntity(PlaceType placeType) {\n' +
        '        MenuEntity menuEntity = new MenuEntity();\n' +
        '        menuEntity.setPlaceType(placeType);\n' +
        '        switch (placeType) {\n' +
        '            case BAR:\n' +
        '                menuEntity.setMenuItems(menuFixtureProperties.getBar());\n' +
        '                break;\n' +
        '            case RESTAURANT:\n' +
        '                menuEntity.setMenuItems(menuFixtureProperties.getRestaurant());\n' +
        '                break;\n' +
        '            case CAFE:\n' +
        '                menuEntity.setMenuItems(menuFixtureProperties.getCafe());\n' +
        '                break;\n' +
        '            case MEAL_TAKEAWAY:\n' +
        '                menuEntity.setMenuItems(menuFixtureProperties.getMealTakeaway());\n' +
        '                break;\n' +
        '            default:\n' +
        '                if (LOGGER.isWarnEnabled()) {\n' +
        '                    LOGGER.warn("Fixtures for menu with place type " + placeType + "were not created.");\n' +
        '                }\n' +
        '                break;\n' +
        '        }\n' +
        '        return menuEntity;\n' +
        '    }\n' +
        '\n' +
        '    protected void saveUsersEntities() {\n' +
        '        UserEntity admin = createUserEntity(usersFixtureProperties.getAdmin());\n' +
        '        userRepositoryService.grantRole(admin.getUserId(), UserRole.ADMIN);\n' +
        '        UserEntity tester = createUserEntity(usersFixtureProperties.getTester());\n' +
        '        UserEntity spoiler = createUserEntity(usersFixtureProperties.getSpoiler());\n' +
        '        userRepositoryService.grantRole(tester.getUserId(), UserRole.USER);\n' +
        '        userRepositoryService.grantRole(spoiler.getUserId(), UserRole.USER);\n' +
        '    }\n' +
        '\n' +
        '    protected UserEntity createUserEntity(RegisterWrapper registerWrapper) {\n' +
        '        UserEntity userEntity = usersRepository.findByEmail(registerWrapper.getEmail());\n' +
        '        if (userEntity != null && usersFixtureProperties.getDeleteExisting()) {\n' +
        '            usersRepository.delete(userEntity.getId());\n' +
        '        }\n' +
        '        return userRepositoryService.registerUser(registerWrapper, Locale.forLanguageTag("en"));\n' +
        '    }\n' +
        '\n' +
        '    protected void saveRatesEntities(RateStatus rateStatus) {\n' +
        '        ratesFixtureProperties.getPlaceIds().get(rateStatus.toString()).forEach(placeId -> {\n' +
        '            PlaceEntity placeEntity = placesRepository.findByVendorPlaceId(placeId);\n' +
        '            if (placeEntity == null) {\n' +
        '                placeEntity = new PlaceEntity(placeId, "Fixture Place");\n' +
        '                placesRepository.save(placeEntity);\n' +
        '            }\n' +
        '        });\n' +
        '        usersRepository.findAll().forEach(user -> createRatesEntity(user, rateStatus));\n' +
        '    }\n' +
        '}'
    ]
  },
  7: {
    id: 7,
    code: [
        'class Customer extends DomainObject {\n' +
        '    public Customer(String name) {\n' +
        '        _name = name;\n' +
        '    }\n' +
        '\n' +
        '    public String statement() {\n' +
        '        double totalAmount = 0;\n' +
        '        int frequentRenterPoints = 0;\n' +
        '        Enumeration rentals = _rentals.elements();\n' +
        '        String result = "Rental Record for " + name() + "\\n";\n' +
        '        while (rentals.hasMoreElements()) {\n' +
        '            double thisAmount = 0;\n' +
        '            Rental each = (Rental) rentals.nextElement();\n' +
        '\n' +
        '            //determine amounts for each line\n' +
        '            switch (each.tape().movie().priceCode()) {\n' +
        '                case Movie.REGULAR:\n' +
        '                    thisAmount += 2;\n' +
        '                    if (each.daysRented() > 2)\n' +
        '                        thisAmount += (each.daysRented() - 2) * 1.5;\n' +
        '                    break;\n' +
        '                case Movie.NEW_RELEASE:\n' +
        '                    thisAmount += each.daysRented() * 3;\n' +
        '                    break;\n' +
        '                case Movie.CHILDRENS:\n' +
        '                    thisAmount += 1.5;\n' +
        '                    if (each.daysRented() > 3)\n' +
        '                        thisAmount += (each.daysRented() - 3) * 1.5;\n' +
        '                    break;\n' +
        '\n' +
        '            }\n' +
        '            totalAmount += thisAmount;\n' +
        '\n' +
        '            // add frequent renter points\n' +
        '            frequentRenterPoints++;\n' +
        '            // add bonus for a two day new release rental\n' +
        '            if ((each.tape().movie().priceCode() == Movie.NEW_RELEASE) && each.daysRented() > 1) frequentRenterPoints++;\n' +
        '\n' +
        '            //show figures for this rental\n' +
        '            result += "\\t" + each.tape().movie().name() + "\\t" + String.valueOf(thisAmount) + "\\n";\n' +
        '\n' +
        '        }\n' +
        '        //add footer lines\n' +
        '        result += "Amount owed is " + String.valueOf(totalAmount) + "\\n";\n' +
        '        result += "You earned " + String.valueOf(frequentRenterPoints) + " frequent renter points";\n' +
        '        return result;\n' +
        '\n' +
        '    }\n' +
        '\n' +
        '    public void addRental(Rental arg) {\n' +
        '        _rentals.addElement(arg);\n' +
        '    }\n' +
        '\n' +
        '    public static Customer get(String name) {\n' +
        '        return (Customer) Registrar.get("Customers", name);\n' +
        '    }\n' +
        '\n' +
        '    public void persist() {\n' +
        '        Registrar.add("Customers", this);\n' +
        '    }\n' +
        '\n' +
        '    private Vector _rentals = new Vector();\n' +
        '}'
    ]
  }
};
