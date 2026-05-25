// Top 150 most common passwords from historical leaks
const COMMON_PASSWORDS = [
    "123456", "password", "123456789", "12345", "12345678", "qwerty", "1234567", "password123", 
    "123123", "111111", "987654321", "1234567890", "iloveyou", "sunshine", "princess", "admin",
    "admin123", "welcome", "login", "secret", "password12", "superman", "monkey", "charlie", 
    "letmein", "trustnoone", "mustang", "football", "soccer", "shadow", "master", "hunter2",
    "baseball", "hockey", "jessica", "michael", "ashley", "daniel", "joshua", "andrew",
    "matthew", "christopher", "elizabeth", "spiderman", "batman", "pokemon", "starwars", 
    "matrix", "hacker", "cyber", "security", "root", "oracle", "cisco", "fortinet",
    "network", "system", "windows", "linux", "macintosh", "android", "iphone", "google",
    "microsoft", "apple", "facebook", "twitter", "instagram", "youtube", "netflix", "disney",
    "summer", "spring", "winter", "autumn", "january", "february", "december", "monday",
    "friday", "sunday", "saturday", "coffee", "pizza", "chocolate", "cookie", "burger",
    "qwertyuiop", "asdfghjkl", "zxcvbnm", "mnbvcxz", "lkjhgfdsa", "poiuytrewq", "qazwsxedc",
    "1234qwer", "1234asdf", "1234zxcv", "7777777", "8888888", "9999999", "0000000",
    "password1234", "password12345", "pass123", "pass321", "user123", "guest123", "temp123",
    "changeit", "changeme", "default", "standard", "test1234", "testing", "welcome1",
    "welcome123", "password!", "passwords", "secret123", "master123", "godfather",
    "freedom", "destiny", "infinity", "universe", "galaxy", "starlight", "dragon",
    "wizard", "warrior", "knight", "phoenix", "falcon", "eagle", "tiger", "lion",
    "panther", "leopard", "cheetah", "jaguar", "wolfpack", "coyote", "badger", "grizzly"
];

// Export standard common passwords
if (typeof module !== 'undefined' && module.exports) {
    module.exports = COMMON_PASSWORDS;
} else {
    window.COMMON_PASSWORDS = COMMON_PASSWORDS;
}
