import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3ECF3',
        paddingTop: 18,
      },
      topSection: {
        alignItems: 'center',
        marginBottom: 20,
      },
      imageWrapper: {
        position: 'relative',
        marginBottom: 10,
        borderColor: '#e4dfe4',
        borderWidth: 10,
        borderRadius: 90,
      },
      image: {
        width: 140,
        height: 140,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#fff',
      },
      editIconWrapper: {
        position: 'absolute',
        right: 10,
        bottom: 0,
        borderRadius: 50,
        padding: 5,
      },
      userId: {
        fontSize: 14,
        color: '#C23A8A',
        marginVertical: 5,
      },
      starsWrapper: {
        flexDirection: 'row',
        marginTop: 5,
      },
      nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      info: {
        fontSize: 20,
        color: 'black',
      },
      editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3ECF3',
        borderRadius: 8,
        padding: 8,
        bottom: 20,
      },
      editText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#C23A8A',
      },
      detailsSection: {
        backgroundColor: 'white',
        borderTopStartRadius: 40,
        borderTopEndRadius:40,
        padding: 25,
      },
      label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#C23A8A',
        marginVertical: 5,
      },
      info: {
        fontSize: 14,
        color: '#000',
        marginBottom: 10,
      },
      description: {
        fontSize: 14,
        color: '#000',
        marginBottom: 10,
      },
      performanceSection: {
        marginTop: 10,
      },
      performanceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#C23A8A',
        marginBottom: 10,
      },
      performanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
      },
      performanceLabel: {
        fontSize: 14,
        color: '#000',
      },
      stars: {
        flexDirection: 'row',
      },
});
